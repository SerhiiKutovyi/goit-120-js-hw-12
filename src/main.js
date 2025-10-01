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
import { btnDisabled, btnEnabled, windowScrollBy } from './js/utils';

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
  page = 1;

  if (!query) {
    hideLoader(refs.loader);
    hideLoadMoreButton(refs.buttonLoadMore);
    btnEnabled(refs.button);

    iziToast.show({
      position: 'topRight',
      iconUrl: './img/Group (1).svg',
      messageColor: 'rgba(255, 255, 255, 1)',
      color: 'rgba(239, 64, 64, 1)',
      message:
        'Sorry, there are no images matching </br> your search query. Please try again!',
    });
    return;
  }

  hideLoadMoreButton(refs.buttonLoadMore);
  showLoader(refs.loader);
  btnDisabled(refs.button);

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
      return;
    }

    createGallery(hits, refs.gallery);
    showLoadMoreButton(refs.buttonLoadMore);
  } catch (error) {
    iziToast.show({
      position: 'topRight',
      iconUrl: './img/Group (1).svg',
      messageColor: 'rgba(255, 255, 255, 1)',
      color: 'rgba(239, 64, 64, 1)',
      message: `${error.message}`,
    });
  } finally {
    hideLoader(refs.loader);
    btnEnabled(refs.button);
  }
});

refs.buttonLoadMore.addEventListener('click', async () => {
  btnDisabled(refs.buttonLoadMore);

  page += 1;
  try {
    const { totalHits, hits } = await getImagesByQuery(query, page);

    const totalPages = Math.ceil(totalHits / hits.length);

    if (page >= totalPages) {
      iziToast.show({
        position: 'topRight',
        iconUrl: './img/Group (1).svg',
        messageColor: 'rgba(255, 255, 255, 1)',
        color: 'rgba(239, 64, 64, 1)',
        message:
          'Sorry, there are no images matching </br> your search query. Please try again!',
      });
      hideLoadMoreButton(refs.buttonLoadMore);
      return;
    }
    createGallery(hits, refs.gallery);
    showLoader(refs.loader);

    const firstItem = document.querySelector('.gallery-img-item');

    if (firstItem) {
      const { height } = firstItem.getBoundingClientRect();

      windowScrollBy(height);
    }
  } catch (error) {
    hideLoadMoreButton(refs.buttonLoadMore);
    iziToast.show({
      position: 'topRight',
      iconUrl: './img/Group (1).svg',
      messageColor: 'rgba(255, 255, 255, 1)',
      color: 'rgba(239, 64, 64, 1)',
      message: `${error.message}`,
    });
  } finally {
    btnEnabled(refs.buttonLoadMore);
    hideLoader(refs.loader);
  }
});
