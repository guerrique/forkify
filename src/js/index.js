import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
// the searchview will become an object in which everything from searchView.js is stored
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
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
      recipeView.clearRecipe();
      renderLoader(elements.recipe);

      // highlight recipe in search results
      if (state.search) searchView.highlightSelected(id);

      // create new recipe object
      state.recipe = new Recipe(id);

      try {
      // get the recipe data and parse the ingredients
      await state.recipe.getRecipe();
      // console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();

      // calctime calcservings
      state.recipe.calcServings();
      state.recipe.calcTime();

      // render recipe
      console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(state.recipe);

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

// handling recipe button clicks (that do not show on first load of page)
elements.recipe.addEventListener('click', e => {
    // btn-decrease * means any child element of btn-decrease
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
      if (state.recipe.servings > 1) {
        state.recipe.updateServings('dec');
      }

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
      state.recipe.updateServings('inc');

    }
    recipeView.updateServingsIngredients(state.recipe);
})

// TEST
window.l = new List();







