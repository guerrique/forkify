import Search from './models/Search';
import Recipe from './models/Recipe';
// the searchview will become an object in which everything from searchView.js is stored
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';
// Global app controller

/* Global state of the app:
- search object
- current recipe object
- shopping list object
- liked recipes */
const state = {};


/* SEARCH CONTROLLER */

const controlSearch = async () => {

  // get query from view
  const query = searchView.getInput();

  if (query) {
    // new search object and add to state
    state.search = new Search(query);

    // prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
    // search for recipes
    await state.search.getResults();

    // display results on UI
    clearLoader();
    searchView.renderResults(state.search.result);

  } catch (error) {
    console.log(error);
    clearLoader();
    alert('Something went wrong in the rendering of the results');
  }

  }

};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
      const goToPage = parseInt(btn.dataset.goto, 10);
      searchView.clearResults();
      searchView.renderResults(state.search.result, goToPage);
      console.log(goToPage);
    }
});

/* RECIPE CONTROLLER */

const controlRecipe = async () => {
    // get id from url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
      // prepare UI for changes


      // create new recipe object
      state.recipe = new Recipe(id);

      try {
      // get the recipe data
      await state.recipe.getRecipe();

      // calctime calcservings
      state.recipe.calcServings();
      state.recipe.calcTime();

      // render recipe
      console.log(state.recipe);

      } catch (error) {
          console.log(error);
          alert('Oups, something went wrong in the rendering of the recipe');
          // best here would be to implement some message on the UI
      }

    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));









