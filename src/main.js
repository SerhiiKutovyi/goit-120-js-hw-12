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

hideLoadMoreButton(refs.buttonLoadMore);

refs.form.addEventListener('submit', handleSubmit);
// refs.buttonLoadMore.addEventListener('click', showLoadMoreButton);

async function handleSubmit(e) {
  e.preventDefault();

  const query = e.target.elements.search.value.trim();

  clearGallery(refs.gallery);

  if (!query) {
    return;
  }

  showLoader(refs.loader);
  btnDisabled(refs.button);

  try {
    const { hits } = await getImagesByQuery(`${query}`, page);

    if (hits.length === 0) {
      iziToast.show({
        position: 'topRight',
        iconUrl: './img/Group (1).svg',
        messageColor: 'rgba(255, 255, 255, 1)',
        color: 'rgba(239, 64, 64, 1)',
        message:
          'Sorry, there are no images matching </br> your search query. Please try again!',
      });
      hideLoadMoreButton(refs.buttonLoadMore);
    }

    createGallery(hits, refs.gallery);
  } catch (error) {
    console.log(error.message);
  } finally {
    hideLoader(refs.loader);
    formReset(refs.form);
    btnEnabled(refs.button);
  }
}
