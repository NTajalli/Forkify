class SearchView {
  _parentElement = document.querySelector('.search');

  /**
   * Gets query string inputted by user in search field
   * @returns {String} query string inputted by user
   */
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  /**
   * Adds event listener for when a search query is submitted
   * @param {Function} handler handler function
   */
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  /**
   * Clears search field
   */
  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
