import Search from './models/Search';
// Global app controller

/* Global state of the app:
- search object
- current recipe object
- shopping list object
- liked recipes */
const state = {};

const controlSearch = () => {

};

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

const search = new Search('pizza');
console.log(search);
search.getResults();

