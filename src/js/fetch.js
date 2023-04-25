import axios from 'axios';

export class AsyncFetch {
  constructor({ question = '', forCheck = '', isFirstTime = false, pixPage = 1, pixPerPage = 40 }) {
    this.BASE_URL = 'https://pixabay.com/api/';
    this.API_KEY = '35547171-cae5b6825d0c3932cea30e9cb';
    this.question = question;
    this.forCheck = forCheck;
    this.isFirstTime = isFirstTime;
    this.pixPage = pixPage;
    this.pixPerPage = pixPerPage;
  }
  incrementPage() {
    this.pixPage += 1;
  }
  resetPage() {
    this.pixPage = 1;
  }
  changePerPage(newPerPage) {
    this.pixPerPage = newPerPage;
  }
  async fetchTheReguest(typeOfUser) {
    return await axios.get(
      `${this.BASE_URL}?key=${this.API_KEY}&q=${typeOfUser}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.pixPerPage}&page=${this.pixPage}`
    );
  }
}
