import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';
import { formReset, btnDisabled, btnEnabled } from './js/utils';

const refs = {
  form: document.querySelector('.form'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader-gallery'),
  button: document.querySelector('.form-btn'),
  buttonLoadMore: document.querySelector('#load-more'),
};

let page = 1;
let query = '';

refs.form.addEventListener('submit', async e => {
  e.preventDefault();

  const queryEle = e.target.elements.search.value.trim();
  query = queryEle;

  clearGallery(refs.gallery);

  if (!query) {
    return;
  }

  showLoader(refs.loader);
  btnDisabled(refs.button);
  hideLoadMoreButton(refs.buttonLoadMore);

  try {
    const { hits } = await getImagesByQuery(queryEle, page);

    if (hits.length === 0) {
      iziToast.show({
        position: 'topRight',
        iconUrl: './img/Group (1).svg',
        messageColor: 'rgba(255, 255, 255, 1)',
        color: 'rgba(239, 64, 64, 1)',
        message:
          'Sorry, there are no images matching </br> your search query. Please try again!',
      });
      formReset(refs.form);
      return;
    }

    createGallery(hits, refs.gallery);
    showLoadMoreButton(refs.buttonLoadMore);
  } catch (error) {
    console.log(error.message);
  } finally {
    hideLoader(refs.loader);

    btnEnabled(refs.button);
  }
});

refs.buttonLoadMore.addEventListener('click', async () => {
  page += 1;

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits, refs.gallery);
  } catch (error) {
    console.log(error.message);
  }
});
