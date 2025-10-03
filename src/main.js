import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import errorIcon from './img/Group (1).svg';

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
const PER_PAGE = 15;

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
      iconUrl: errorIcon,
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
    const { hits, totalHits } = await getImagesByQuery(queryEle, page);

    if (!hits || hits.length === 0) {
      iziToast.show({
        position: 'topRight',
        iconUrl: errorIcon,
        messageColor: 'rgba(255, 255, 255, 1)',
        color: 'rgba(239, 64, 64, 1)',
        message:
          'Sorry, there are no images matching </br> your search query. Please try again!',
      });
      return;
    }

    createGallery(hits, refs.gallery);

    const totalPages = Math.ceil(totalHits / PER_PAGE);

    if (totalPages > 1) {
      showLoadMoreButton(refs.buttonLoadMore);
    } else {
      hideLoadMoreButton(refs.buttonLoadMore);
      iziToast.show({
        position: 'topRight',
        iconUrl: errorIcon,
        messageColor: 'rgba(255, 255, 255, 1)',
        color: 'rgba(235, 238, 66, 1)',
        message: "You've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.show({
      position: 'topRight',
      iconUrl: errorIcon,
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
  showLoader(refs.loader);

  page += 1;
  try {
    const { totalHits, hits } = await getImagesByQuery(query, page);

    if (hits && hits.length > 0) {
      createGallery(hits, refs.gallery);
    }

    const totalPages = Math.ceil(totalHits / PER_PAGE);

    if (page >= totalPages) {
      hideLoadMoreButton(refs.buttonLoadMore);
      iziToast.show({
        position: 'topRight',
        iconUrl: errorIcon,
        messageColor: 'rgba(255, 255, 255, 1)',
        color: 'rgba(235, 238, 66, 1)',
        message: "You've reached the end of search results.",
      });
    } else {
      showLoadMoreButton(refs.buttonLoadMore);
    }

    const firstItem = document.querySelector('.gallery-img-item');

    if (firstItem) {
      const { height } = firstItem.getBoundingClientRect();
      windowScrollBy(height);
    }
  } catch (error) {
    hideLoadMoreButton(refs.buttonLoadMore);
    iziToast.show({
      position: 'topRight',
      iconUrl: errorIcon,
      messageColor: 'rgba(255, 255, 255, 1)',
      color: 'rgba(239, 64, 64, 1)',
      message: `${error.message}`,
    });
  } finally {
    btnEnabled(refs.buttonLoadMore);
    hideLoader(refs.loader);
  }
});
