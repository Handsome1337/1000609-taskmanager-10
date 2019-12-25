import AbstractComponent from './abstract-component.js';

const FILTER_ID_PREFIX = `filter__`;

/* Возвращает название фильтра */
const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

/* Возвращает разметку фильтра */
const createFilterMarkup = (filter, isChecked) => {
  const {name, count} = filter;

  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? `checked` : ``}
    />
    <label for="filter__${name}" class="filter__label">
      ${name} <span class="filter__${name}-count">${count}</span>
    </label>`
  );
};

/* Возвращает шаблон резметки фильтров */
const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFilterMarkup(it, it.checked)).join(`\n`);

  return (
    `<section class="main__filter filter container">
      ${filtersMarkup}
    </section>`
  );
};

/* Экспортирует класс (компонент) фильтров сайта */
export default class Filter extends AbstractComponent {
  constructor(filters) {
    /* Вызывает конструктор родителя */
    super();
    /* Сохраняет переданные в параметр конструктора данные */
    this._filters = filters;
  }

  /* Возвращает разметку шаблона */
  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  /* Обработчик изменения фильтра */
  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
