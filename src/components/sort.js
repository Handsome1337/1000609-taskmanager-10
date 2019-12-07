import {createElement} from './../util.js';

/* Возвращает шаблон разметки сортировки */
const createSortTemplate = () => {
  return (
    `<div class="board__filter-list">
      <a href="#" class="board__filter">SORT BY DEFAULT</a>
      <a href="#" class="board__filter">SORT BY DATE up</a>
      <a href="#" class="board__filter">SORT BY DATE down</a>
    </div>`
  );
};

/* Экспортирует класс (компонент) сортировки */
export default class Sort {
  constructor() {
    /* Сохраняет DOM-узел */
    this._element = null;
  }

  /* Возвращает разметку шаблона */
  getTemplate() {
    return createSortTemplate();
  }

  /* Если DOM-узла раньше не существовало, сохраняет созданный из шаблона DOM-узел и возвращает его */
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  /* Удаляет ссылку на созданный DOM-узел */
  removeElement() {
    this._element = null;
  }
}
