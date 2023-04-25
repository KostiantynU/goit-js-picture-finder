import { fetchTheReguest } from './fetch';
import { refs } from './refs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import LoadMoreBtnClass from './loadMoreBtnClass.js';
import { AsyncFetch } from './fetch';

// const loadMoreEl = new LoadMoreBtnClass({ selector: '.load-more', isHidden: true });
refs.searchFormEl.addEventListener('submit', onFormSubm);
// loadMoreEl.button.addEventListener('click', loadMore);
refs.galleryEl.addEventListener('click', disableClickOnLink);
window.addEventListener('scroll', handleScroll);

const asyncRequest = new AsyncFetch({});
const lightbox = new SimpleLightbox('.gallery a');

function greeting() {
  refs.galleryEl.innerHTML =
    '<h1 class="greeting-title">Hello! This is service for search pictures! Type your question at the top of page!';
  refs.title = document.querySelector('.greeting-title');
  refs.isTitleTrue = true;
  setInterval(() => {
    refs.title.classList.add('greeting-title-shown');
  }, 1000);
  setInterval(() => {
    refs.title.classList.remove('greeting-title-shown');
  }, 2000);
}
greeting();

function onFormSubm(event) {
  event.preventDefault();

  asyncRequest.question = event.currentTarget.searchQuery.value.trim();
  if (asyncRequest.question !== asyncRequest.forCheck) {
    asyncRequest.resetPage();
  }
  const someResult = giveMeResult();
  someResult.then(resultArray => renderResult(prepareResult(resultArray)));

  asyncRequest.incrementPage();
  refs.searchFormEl.reset();
}

async function giveMeResult() {
  try {
    const { data } = await asyncRequest.fetchTheReguest(asyncRequest.question);
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.galleryEl.innerHTML = '';
      // loadMoreEl.hide();
      asyncRequest.resetPage();
      return;
    }

    if (asyncRequest.question !== asyncRequest.forCheck) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
    asyncRequest.forCheck = asyncRequest.question;
    asyncRequest.incrementPage();
    // loadMoreEl.show();
    return data.hits;
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Something going wrong, look at console for details');
  }
}

// async function loadMore() {
//   try {
//     // loadMoreEl.hide();

//     const { data } = await asyncRequest.fetchTheReguest(asyncRequest.question);
//     console.log(data);
//     if (asyncRequest.pixPage === 14) {
//       Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
//       // loadMoreEl.hide();
//       return;
//     }
//     addResult(prepareResult(data.hits));
//     // loadMoreEl.show();
//     asyncRequest.incrementPage();
//   } catch (error) {
//     console.log(error);
//     Notiflix.Notify.failure('Something going wrong, look at console for details');
//   }
// }

async function loadMoreFromScroll() {
  try {
    // loadMoreEl.hide();

    const { data } = await asyncRequest.fetchTheReguest(asyncRequest.question);

    if (data.totalHits / (data.hits.length * asyncRequest.pixPage) <= 1) {
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
      // loadMoreEl.hide();
      return;
    }
    addResult(prepareResult(data.hits));

    asyncRequest.incrementPage();
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Something going wrong, look at console for details');
  }
}

function prepareResult(resultArray) {
  const markup = resultArray
    .map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) => {
      return `<div class="photo-card">
          <a class="img-link" href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" class='small-images' /></a>
          <div class="info">
            <p class="info-item">
              <b>Likes:</b> ${likes}
            </p>
            <p class="info-item">
              <b>Views</b> ${views}
            </p>
            <p class="info-item">
              <b>Comments</b> ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b> ${downloads}
            </p>
          </div>
        </div>`;
    })
    .join('');
  return markup;
}

function renderResult(markup) {
  refs.galleryEl.innerHTML = markup;
  lightbox.refresh();
}

function addResult(markup) {
  if (refs.isTitleTrue) {
    refs.title.remove();
  }
  refs.galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  myScroll();
}
function disableClickOnLink(event) {
  if ((event.target.nodeName = 'img')) {
    event.preventDefault();
  }
}

function myScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  // console.log(scrollTop, scrollHeight, clientHeight);
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loadMoreFromScroll();
  }
}
