import View from './view.js';
import icons from 'url:../../img/icons.svg';
import { RES_PER_PAGE } from '../config.js';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  /**
   * Generates markup string for the page button(s)
   * @returns {String} markup string
   */
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currentPage = this._data.page;
    const nextPageMarkup = `<button data-goto="${
      currentPage + 1
    }" class="btn--inline pagination__btn--next">
              <span>Page ${currentPage + 1}</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
            </button>`;
    const prevPageMarkup = `<button data-goto="${
      currentPage - 1
    }" class="btn--inline pagination__btn--prev">
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
              </svg>
              <span>Page ${currentPage - 1}</span>
            </button>`;
    const allPagesMarkup = this._generateAllPagesMarkup(numPages);
    console.log('Whats up');

    //Page 1, and more pages
    if (currentPage === 1 && numPages > 1) {
      return `${allPagesMarkup} \n ${nextPageMarkup}`;
    }
    //Page 1, only page
    if (currentPage === 1 && numPages === 1) {
      return allPagesMarkup;
    }
    //Last page
    if (currentPage === numPages && numPages > 1) {
      return `${prevPageMarkup} \n ${allPagesMarkup}`;
    }
    //Other page
    if (currentPage < numPages) {
      return `${prevPageMarkup} \n ${allPagesMarkup} \n ${nextPageMarkup}`;
    }
  }

  /**
   * Event listener for changing the page when a page button is clicked
   * @param {Function} handler
   */
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateAllPagesMarkup(numPages) {
    const pageMarkupArr = [];
    for (let i = 0; i < numPages; i++) {
      pageMarkupArr.push(`<button class="btn--xsmall pagination__btn--prev">
            <span>${i + 1}</span>
          </button>`);
    }
    console.log(pageMarkupArr.join('\n'));
    return pageMarkupArr.join('\n');
  }
}

export default new PaginationView();
