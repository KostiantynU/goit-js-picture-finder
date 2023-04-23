const axios = require('axios').default;
import { refs } from './refs';
export async function fetchTheReguest(typeOfUser) {
  return await axios.get(
    `${refs.BASE_URL}?key=${refs.API_KEY}&q=${typeOfUser}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${refs.pixPerPage}&page=${refs.pixPage}`
  );
}
