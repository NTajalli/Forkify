import icons from 'url:../../img/icons.svg';

/**
 * Parent View class to be used on all different views of the window
 */
export default class View {
  _data;

  /**
   * Renders inputted data to DOM
   * @param {Object | Object[]} data The data to be rendered
   * @param {Boolean} [render = true] If false, returns markup string, else adds the markup to the DOM
   * @returns {Undefined | String} Returns markup string if render is false
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup(data);

    if (!render) return this._generateMarkup();

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Clears the HTML of the parent element
   */
  _clear() {
    this._parentElement.innerHTML = '';
  }

  /**
   * Renders the loading spinner to the parent element
   */
  renderSpinner() {
    const markup = `<div class="spinner">
    <svg>
    <use href="${icons}#icon-loader"></use>
    </svg>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Renders error message to parent element
   * @param {String} message Error message to be displayed
   */
  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
    <div>
    <svg>
    <use href="${icons}#icon-alert-triangle"></use>
    </svg>
    </div>
    <p>${message}</p>
    </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Renders success message to the parent element
   * @param {String} message
   */
  renderMessage(message = this._message) {
    const markup = `<div class="message">
    <div>
    <svg>
    <use href="${icons}#icon-smile"></use>
    </svg>
    </div>
    <p>${message}</p>
    </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Updates the DOM of the parent element based on the differences between the new markup and current markup
   * @param {Object} data Recipe object to update DOM
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //Updates text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      //Updates attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }
}
