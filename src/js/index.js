import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
// the searchview will become an object in which everything from searchView.js is stored
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';
// Global app controller

/* Global state of the app:
- search object
- current recipe object
- shopping list object
- liked recipes */
const state = {};

// TEST
window.state = state;


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
      // console.log(state.recipe);
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

// LIST CONTROLLER
const controlList = () => {
  // create a new list if there is not yet a list
  if (!state.list) state.list = new List();

  // add each ingredient to the list
  state.recipe.ingredients.forEach(el => {
      const item = state.list.addItem(el.count, el.unit, el.ingredient);
      listView.renderItem(item);
  });

};


// LIKE CONTROLLER
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();

  const currentID = state.recipe.id;

  // user has not yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // add like to the state
    const newLike = state.likes.addLiked(
    currentID,
    state.recipe.author,
    state.recipe.title,
    state.recipe.img
    );

    // toggle the like button

    // add like to the UI list
    console.log(state.likes);

  // user has liked current recipe
  } else {
    // remove like from the state
    state.likes.deleteLike(currentID);
    // toggle the like button

    // remove like from the UI
    console.log(state.likes);

  }
};





// handling recipe button clicks (that do not show on first load of page)
elements.recipe.addEventListener('click', e => {
    // btn-decrease * means any child element of btn-decrease
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
      if (state.recipe.servings > 1) {
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
      }

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
      // increase button is clicked
      state.recipe.updateServings('inc');
      recipeView.updateServingsIngredients(state.recipe);

    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
      // add ingredients to shopping list
      controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
      //
      controlLike();
    }
})

// handling delete and update list item events
  elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
      // delete from state
      state.list.deleteItem(id);

      // delete from UI
      listView.deleteItem(id);

    } else if (e.target.matches('.shopping__count-value')) {
      // read data from interface
        const val = parseFloat(e.target.value, 10);
      // update the data
        state.list.updateCount(id, val);
    }
  });

// TEST
window.l = new List();







