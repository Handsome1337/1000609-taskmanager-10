import {createElement} from './../util.js';

/* Возвращает шаблон разметки кнопки "Load more" */
const createLoadMoreButtonTemplate = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

/* Экспортирует класс (компонент) кнопки "Load more" */
export default class LoadMoreButton {
  constructor() {
    /* Сохраняет DOM-узел */
    this._element = null;
  }

  /* Возвращает разметку шаблона */
  getTemplate() {
    return createLoadMoreButtonTemplate();
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
