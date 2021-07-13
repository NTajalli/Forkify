import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
//import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
export const state = {
  recipe: {},
  search: { query: '', results: [], resultsPerPage: RES_PER_PAGE, page: 1 },
  bookmarks: [],
};

/**
 * Transforms inputted data into a recipe object
 * @param {Object} JSON data from API
 * @returns {Object} A recipe object
 */
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    bookmarked: false,
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * Loads recipe data based on id inputted and sets recipe property of state to that recipe
 * @param {Number | String} id Unique id associated with a specific recipe
 */
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(rec => rec.id === state.recipe.id))
      state.recipe.bookmarked = true;
  } catch (err) {
    throw err;
  }
};

/**
 * Loads search results based on inputted query by fetching data from API and setting results array of search property of state to the retrieved recipes
 * @param {String} query Search query inputted by user
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}/?search=${query}&?key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

/**
 * Gets results array of recipes based on the inputted page
 * @param {Number} [page = 1] Page of results that is to be loaded
 * @returns State search results array, but limited to the elements that are dedicated to that page
 */
export const getSearchResultsPage = function (page = state.search.page) {
  const start = state.search.resultsPerPage * (page - 1);
  const end = state.search.resultsPerPage * page;
  state.search.page = page;

  return state.search.results.slice(start, end);
};

/**
 * Updates each of the quantity of ingredients of a recipe based on the newServings inputted
 * @param {Number} newServings New servings to be used for calculation
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity / state.recipe.servings) * newServings;
  });
  state.recipe.servings = newServings;
};

/**
 * Stores bookmarked recipes into local storage
 */
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/**
 * Adds bookmark to bookmarks array based on inputted recipe and sets bookmarked property of the recipe to true
 * Adds to local storage
 * @param {Object} recipe Recipe object to be added as a bookmark
 */
export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  //Store in local storage
  persistBookmarks();
};

/**
 * Removes bookmark from bookmarks array based on inputted recipe and sets bookmarked property of the recipe to false
 * Removes from local storage
 * @param {Object} recipe Recipe object to be added as a bookmark
 */
export const deleteBookmark = function (id) {
  //Remove bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //Mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  //Store in local storage
  persistBookmarks();
};

/**
 * Gets bookmarked recipes from local storage
 */
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

/**
 * Clears local storage of all bookmarks
 */
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

/**
 * Formats and Uploads inputted recipe to API and sets current recipe state to inputted recipe
 * @param {Object} newRecipe
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error('Wrong ingredient format! Please use correct format');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
      bookmarked: false,
      key: KEY,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
