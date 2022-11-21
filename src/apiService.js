import axios from 'axios';
export { fetchCards };

async function fetchCards(name, page, perPage) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = 'key=31381634-1aa714b0129639c0faecef278';

  try {
    const response = await axios.get(
      `${BASE_URL}?${API_KEY}&q=${name}&image_type=photo&
      orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
}
