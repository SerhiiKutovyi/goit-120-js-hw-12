import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = null;

export function createGallery(data, gallery) {
  const markup = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <li class='gallery-img-item'>
        <div class="box-img">
         <a href='${largeImageURL}'>
          <img src="${webformatURL}" alt="${tags} "/>
         </a>
        </div>
     
        <div class='gallery-wrapper-text'>
          <p class='gallery-img-text'>Likes <span class='gallery-span'>${likes}</span></p>
          <p class='gallery-img-text'>Views<span class='gallery-span'>${views}</span></p>
          <p class='gallery-img-text'>Comments<span class='gallery-span'>${comments}</span></p>
          <p class='gallery-img-text'>Downloads<span class='gallery-span'>${downloads}</span></p>
        </div>
      </li>
    `;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    lightbox.refresh();
  }
}

export function clearGallery(gallery) {
  gallery.innerHTML = '';
}

export function showLoader(loader) {
  loader.classList.remove('hidden');
}

export function hideLoader(loader) {
  loader.classList.add('hidden');
}

export function showLoadMoreButton(showButton) {
  showButton.classList.remove('hidden-btn');
}

export function hideLoadMoreButton(showButton) {
  showButton.classList.add('hidden-btn');
}
