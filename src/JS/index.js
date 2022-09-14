import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import '../css/styles.css';
import { fetchCountries } from './fetchCountries';
import { refs } from './refs';
import createCountryCardMarkup from '../templates/country-card.hbs';
import createListOfCountriesMarkup from '../templates/list-of-countries.hbs';

const DEBOUNCE_DELAY = 300;

const cleanAllMarkup = () => {
  refs.countryList.innerHTML = '';
  refs.countryCard.innerHTML = '';
};

const overflowWarning = () => {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
};

const errorReport = () => {
  cleanAllMarkup();
  Notiflix.Notify.failure(`Oops, there is no country with that name`);
};

const makeCountriesList = data => {
  const listOfCountries = createListOfCountriesMarkup(data);
  refs.countryCard.innerHTML = '';
  refs.countryList.innerHTML = listOfCountries;
};

const makeCountryInfoCard = data => {
  const countryCard = createCountryCardMarkup(data[0]);
  refs.countryCard.innerHTML = countryCard;
  refs.countryList.innerHTML = '';
};

const countryInputHandler = e => {
  const countryName = e.target.value.trim();

  if (e.target.value === '') {
    cleanAllMarkup();
    return;
  }

  fetchCountries(countryName)
    .then(data => {
      if (data.length > 10) {
        cleanAllMarkup();
        overflowWarning();
      }

      if (data.length > 1 && data.length <= 10) {
        makeCountriesList(data);
      }

      if (data.length === 1) {
        makeCountryInfoCard(data);
      }
    })
    .catch(() => errorReport());
};

refs.countryInput.addEventListener(
  'input',
  debounce(countryInputHandler, DEBOUNCE_DELAY)
);
