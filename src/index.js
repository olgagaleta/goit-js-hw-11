import Notiflix from 'notiflix';
import { fetchCards } from '../src/apiService.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import simpleLightbox from 'simplelightbox';

const refs = {
  form: document.querySelector('.search-form'),
  loadButton: document.querySelector('.load-more'),
  searchQuery: document.querySelector('input[name="searchQuery"]'),
  gallery: document.querySelector('.gallery'),
};

let perPage = 40;
let page = 0;
let name = '';

// ref.loadButton.style.display = 'none';

refs.loadButton.classList.add('is-hidden');

async function handleFormSubmit(e) {
  e.preventDefault();

  name = e.target.elements['searchQuery'].value.trim();

  if (name === '') return;
  refs.gallery.innerHTML = '';

  // ref.loadButton.style.display = 'none';

  refs.loadButton.classList.add('is-hidden');

  page = 1;
  name = refs.searchQuery.value;

  fetchCards(name, page, perPage)
    .then(name => {
      let totalPages = name.totalHits / perPage;

      if (name.hits.length > 0) {
        Notiflix.Notify.success(`Hooray! We found ${name.totalHits} images.`);
        renderGallery(name);
        new SimpleLightbox('.gallery a');

        if (page < totalPages) {
          // ref.loadButton.style.display = 'block';
          refs.loadButton.classList.remove('is-hidden');
        } else {
          // ref.loadButton.style.display = 'none';
          refs.loadButton.classList.add('is-hidden');

          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        refs.gallery.innerHTML = '';
      }
    })
    .catch(error => console.log(error.message));
}

function renderGallery(name) {
  const markup = name.hits
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
        <div class="photo-card">
      <a class = "gallery__link" href="${largeImageURL}">
        <img src="${webformatURL}" class="gallery__image" alt="${tags}" loading="lazy"/></a>
        <div class="info">
          <p class="info-item">
          <b>Likes</b> ${likes}
        </p>
          <p class="info-item">
            <b>Views</b> ${views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${downloads}
          </p>
        </div>
      </div>
     `;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

refs.loadButton.addEventListener(
  'click',
  () => {
    name = refs.searchQuery.value;
    page += 1;

    fetchCards(name, page, perPage).then(name => {
      let totalPages = name.totalHits / perPage;
      renderGallery(name);

      new SimpleLightbox('.gallery a');

      loadScroll();
      simpleLightbox.refresh();

      if (page >= totalPages) {
        refs.loadButton.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    });
  },
  true
);

function loadScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

refs.form.addEventListener('submit', handleFormSubmit);
