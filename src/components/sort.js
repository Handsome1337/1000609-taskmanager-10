import AbstractComponent from './abstract-component.js';

/* Типы сортировки */
export const SortType = {
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`,
  DEFAULT: `default`
};

/* Возвращает шаблон разметки сортировки */
const createSortTemplate = () => {
  return (
    `<div class="board__filter-list">
      <a href="#" data-sort-type="${SortType.DEFAULT}" class="board__filter">SORT BY DEFAULT</a>
      <a href="#" data-sort-type="${SortType.DATE_UP}" class="board__filter">SORT BY DATE up</a>
      <a href="#" data-sort-type="${SortType.DATE_DOWN}" class="board__filter">SORT BY DATE down</a>
    </div>`
  );
};

/* Экспортирует класс (компонент) сортировки */
export default class Sort extends AbstractComponent {
  constructor() {
    /* Вызывает конструктор родителя */
    super();
    /* Сохраняет переданные в параметр конструктора данные */
    this._currentSortType = SortType.DEFAULT;
  }
  /* Возвращает разметку шаблона */
  getTemplate() {
    return createSortTemplate();
  }

  /* Устанавливает обработчик изменения типа сортировки */
  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      /* Проверяет, является ли элемент, на котором произошёл клик, ссылкой */
      if (evt.target.tagName !== `A`) {
        return;
      }

      /* Сохраняет тип сортировки */
      const sortType = evt.target.dataset.sortType;

      /* Проверяет, совпадает ли текущий тип сортировки с новым */
      if (this._currentSortType === sortType) {
        return;
      }

      /* Перезаписывает текущий тип сортировки */
      this._currentSortType = sortType;

      /* Сортирует задачи */
      handler(this._currentSortType);
    });
  }
}
