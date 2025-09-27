import axios from 'axios';

const API_KEY = '32386885-8dbf1bc36075d10a6eaf5580b';
axios.defaults.baseURL = 'https://pixabay.com/api/';

let page = 1;

const getImagesByQuery = async (query, page = 1) => {
  try {
    const response = await axios.get('', {
      params: {
        key: API_KEY,
        q: `${query}`,
        image_type: 'photo',
        page,
        per_page: 15,
      },
    });
    console.log(response);
  } catch (error) {
    alert(`${error.message}`);
  }
};

getImagesByQuery('cat', page);
