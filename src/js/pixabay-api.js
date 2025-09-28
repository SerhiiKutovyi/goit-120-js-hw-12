import axios from 'axios';

const API_KEY = '32386885-8dbf1bc36075d10a6eaf5580b';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1) {
  const response = await axios.get('', {
    params: {
      key: API_KEY,
      q: `${query}`,
      image_type: 'photo',
      page,
      per_page: 15,
    },
  });

  return response.data;
}
