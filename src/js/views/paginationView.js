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
    }" class="btn--inline pagination__btn--middle">
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
              </svg>
              <span>Page ${currentPage - 1}</span>
            </button>`;
    const allPagesMarkup = this._generateAllPagesMarkup(numPages, currentPage);
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
      const btn =
        e.target.closest('.pagination__btn--prev') ||
        e.target.closest('.pagination__btn--next') ||
        e.target.closest('.pagination__btn--middle');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateAllPagesMarkup(numPages, currentPage) {
    const pageMarkupArr = [];
    const startPage = function () {
      if (numPages <= 5) return 0;
      if (currentPage + 2 <= numPages && currentPage - 2 > 0)
        return currentPage - 3;
      if (currentPage + 2 > numPages) return numPages - 5;
      return 0;
    };
    console.log(startPage());
    for (let i = startPage(); i < numPages && i < startPage() + 5; i++) {
      const markup = `<button data-goto="${
        i + 1
      }" class="btn--inlinetiny btn--tiny pagination__btn--middle${
        i + 1 == currentPage ? '--current' : ''
      }">
            <span>${i + 1}</span>
          </button>`;
      pageMarkupArr.push(markup);
    }
    console.log(pageMarkupArr.join('\n'));
    return pageMarkupArr.join('\n');
  }
}

export default new PaginationView();
