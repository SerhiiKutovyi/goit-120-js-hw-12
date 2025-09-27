import { getImagesByQuery } from './js/pixabay-api';

const refs = {
  form: document.querySelector('.form'),
  gallery: document.querySelector('.gallery'),
};

let page = 1;

refs.form.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
  e.preventDefault();

  const query = e.target.elements.search.value;

  getImagesByQuery(`${query}`, page)
    .then(res => console.log(res))
    .catch(error => {
      console.log(error.message);
    });
}
