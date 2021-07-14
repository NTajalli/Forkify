import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

/**
 * Controlls recipes by first loading the recipe using the URL hash and then loading the recipe data and rendering it
 * This function is called whenever the page is loaded or the URL hash is changed
 * Smaller functionalities include rendering the loading spinner, showing the recipe as selected on bookmarks tab as well as results view
 */
const controllRecipes = async function () {
  try {
    //Retrieve hash from URL for recipe id and render the loading spinner
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //Show selected recipe in results view and bookmarks tab
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    //Load recipe data
    await model.loadRecipe(id);

    //Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

/**
 * Controlls the recipes that are displayed after a search by getting the search query and loading the results data and rendering it based on the query
 * If the query is not valid or displays no results, an error is displayed to the user
 * Called whenever a search query is submitted
 * Smaller functionalities include rendering the spinner as well as rendering the pagination buttons to divide the results into pages to avoid an excessively long page
 */
const controllSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //Load the search results
    await model.loadSearchResults(query);

    //Render the results
    resultsView.render(model.getSearchResultsPage());

    //Render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    resultsView.renderError(err);
  }
};

/**
 * Controls the page that is displayed based on the page that is to be loaded
 * Called whenever a page button is clicked (i.e: Going back to page 1 or Going to page 2)
 * @param {Number} goToPage The page that is to be loaded
 */
const controlPagination = function (goToPage) {
  //Render new the results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //Render new pagination buttons
  paginationView.render(model.state.search);
};

/**
 * Controls the amount of servings that the user desires and changes ingredient amounts based upon that
 * Called whenever the amount of servings is increased (increase or decrease servings button is clicked)
 * @param {Number} newServings The amount of servings that the servings is being set to
 */
const controlServings = function (newServings) {
  //Update recipe servings
  model.updateServings(newServings);

  //Render the new recipe servings
  recipeView.update(model.state.recipe);
};

/**
 * Adds or removes a bookmark and stores it in the local storage as well as renders it on the bookmarks tab and fills the bookmarks icon
 * Called whenever the bookmark icon is clicked
 */
const controlBookmark = function () {
  //Mark recipe as bookmarked or not and add/remove bookmark
  !model.state.recipe.bookmarked
    ? model.addBookmark(model.state.recipe)
    : model.deleteBookmark(model.state.recipe.id);

  //Update view
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Controls what the bookmarks tab displays based on the bookmarked recipes
 * If no bookmarks, message to add bookmarks is displayed
 * Called whenever the page is loaded
 */
const controlBookmarkRendering = function () {
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Controlls uploading new recipes based on the inputted form and the recipe object that is formed by that data
 * Displays recipe, bookmarks recipe, changes URL to match recipe ID, and displays success message whenever a recipe is uploaded to the API successfully
 *
 * @param {Object} newRecipe The recipe object that is to be uploaded
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    //Render loading spinner
    addRecipeView.renderSpinner();

    //Upload recipe to API
    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Update URL ID
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

/**
 * Adds all the event handlers for all the controls
 */
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarkRendering);
  recipeView.addHandlerRender(controllRecipes);
  searchView.addHandlerSearch(controllSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
