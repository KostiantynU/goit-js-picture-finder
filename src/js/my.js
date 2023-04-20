import { fetchTheReqguest } from './fetch';
import { refs } from './refs';
import Notiflix from 'notiflix';

// refs.searchFormEl.addEventListener('input', scanInput);
refs.searchFormEl.addEventListener('submit', onFormSubm);

function onFormSubm(event) {
  event.preventDefault();
  const question = event.currentTarget.searchQuery.value.trim();
  const resultArr = fetchTheReqguest(question);
  resultArr.then(({ data }) => {
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    prepareResult(data.hits);
  });
  refs.searchFormEl.reset();
}

function prepareResult(resultArray) {
  const markup = resultArray
    .map(element => {
      return `<div class="photo-card">
          <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes:</b> ${element.likes}
            </p>
            <p class="info-item">
              <b>Views</b> ${element.views}
            </p>
            <p class="info-item">
              <b>Comments</b> ${element.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b> ${element.downloads}
            </p>
          </div>
        </div>`;
    })
    .join('');
  renderResult(markup);
}

function renderResult(markup) {
  refs.galleryEl.innerHTML = markup;
}
