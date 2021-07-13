import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query. Try again.';
  _message = '';

  /**
   * Generates markup string based on the preview markup generated for that data
   * @returns {String} markup string
   */
  _generateMarkup() {
    return this._data.map(rec => previewView.render(rec, false)).join('');
  }
}

export default new ResultsView();
