import {createElement} from './../util.js';

/* Возвращает шаблон разметки доски для задач */
const createBoardTemplate = () => {
  return (
    `<section class="board container"></section>`
  );
};

/* Экспортирует класс (компонент) доски задач */
export default class Board {
  constructor() {
    /* Сохраняет DOM-узел */
    this._element = null;
  }

  /* Возвращает разметку шаблона */
  getTemplate() {
    return createBoardTemplate();
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
