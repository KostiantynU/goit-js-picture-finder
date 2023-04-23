const refs = {
  searchFormEl: document.getElementById('search-form'),
  submitBtn: document.querySelector('.search-form button'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreEl: document.querySelector('.load-more'),
  question: '',
  forCheck: '',
  isFirstTime: false,
  pixPage: 1,
  pixPerPage: 40,
  BASE_URL: 'https://pixabay.com/api/',
  API_KEY: '35547171-cae5b6825d0c3932cea30e9cb',
};
export { refs };
