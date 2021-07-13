import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a recipe to bookmark!';
  _message = '';

  /**
   * Generates markup string based on the preview markup generated for that data
   * @returns {String} markup string
   */
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

  /**
   * Event listener that renders the bookmarked recipes whenever the page is loaded
   * @param {Function} handler handler function
   */
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarksView();
