import { fetchTheReguest } from './fetch';
import { refs } from './refs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import LoadMoreBtnClass from './loadMoreBtnClass.js';

const loadMoreEl = new LoadMoreBtnClass({ selector: '.load-more', isHidden: true });
refs.searchFormEl.addEventListener('submit', onFormSubm);
loadMoreEl.button.addEventListener('click', loadMore);
refs.galleryEl.addEventListener('click', disableClickOnLink);
window.addEventListener('scroll', handleScroll);

const lightbox = new SimpleLightbox('.gallery a');

function onFormSubm(event) {
  event.preventDefault();

  refs.question = event.currentTarget.searchQuery.value.trim();
  if (refs.question !== refs.forCheck) {
    refs.pixPage = 1;
  }
  const someResult = giveMeResult();
  someResult.then(resultArray => renderResult(prepareResult(resultArray)));

  refs.pixPage += 1;
  refs.searchFormEl.reset();
}

async function giveMeResult() {
  try {
    const { data } = await fetchTheReguest(refs.question);
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.galleryEl.innerHTML = '';
      loadMoreEl.hide();
      refs.pixPage = 1;
      return;
    }

    if (refs.question !== refs.forCheck) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
    refs.forCheck = refs.question;
    refs.pixPage += 1;
    loadMoreEl.show();
    return data.hits;
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Something going wrong, look at console for details');
  }
}

async function loadMore() {
  try {
    loadMoreEl.hide();

    const { data } = await fetchTheReguest(refs.question);

    if (refs.pixPage === 14) {
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
      loadMoreEl.hide();
      return;
    }
    addResult(prepareResult(data.hits));
    loadMoreEl.show();
    refs.pixPage += 1;
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Something going wrong, look at console for details');
  }
}

async function loadMoreFromScroll() {
  try {
    loadMoreEl.hide();

    const { data } = await fetchTheReguest(refs.question);

    if (refs.pixPage === 14) {
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
      loadMoreEl.hide();
      return;
    }
    addResult(prepareResult(data.hits));

    refs.pixPage += 1;
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
  myScroll();
}

function addResult(markup) {
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
