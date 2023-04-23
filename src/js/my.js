import { fetchTheReguest } from './fetch';
import { refs } from './refs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

refs.searchFormEl.addEventListener('submit', onFormSubm);
refs.loadMoreEl.addEventListener('click', loadMore);
refs.galleryEl.addEventListener('click', disableClickOnLink);
window.addEventListener('scroll', handleScroll);

const lightbox = new SimpleLightbox('.gallery a');

function onFormSubm(event) {
  event.preventDefault();
  refs.question = event.currentTarget.searchQuery.value.trim();
  if (refs.question !== refs.forCheck) {
    refs.pixPage = 1;
  }
  const resultQuestion = fetchTheReguest(refs.question);
  resultQuestion.then(({ data }) => {
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.galleryEl.innerHTML = '';
      refs.loadMoreEl.classList.add('is-hidden');
      return;
    }
    renderResult(prepareResult(data.hits));

    if (refs.question !== refs.forCheck) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
    refs.forCheck = refs.question;

    refs.pixPage += 1;
    refs.loadMoreEl.classList.remove('is-hidden');
  });

  refs.searchFormEl.reset();
}

function loadMore() {
  refs.loadMoreEl.classList.add('is-hidden');

  const resultQuestion = fetchTheReguest(refs.question);
  resultQuestion.then(({ data, headers }) => {
    if (refs.pixPage === 14) {
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
      refs.loadMoreEl.classList.add('is-hidden');
      return;
    }
    addResult(prepareResult(data.hits));
  });

  refs.loadMoreEl.classList.remove('is-hidden');
  refs.pixPage += 1;
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
    loadMore();
  }
}
