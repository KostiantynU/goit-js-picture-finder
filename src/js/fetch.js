const axios = require('axios').default;
import { refs } from './refs';
export async function fetchTheReqguest(typeOfUser) {
  return await axios.get(
    `${refs.BASE_URL}?key=${refs.API_KEY}&q=${typeOfUser}&image_type=photo&orientation=horizontal&safesearch=true`
  );
}
