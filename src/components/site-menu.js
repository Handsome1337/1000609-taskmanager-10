import {createElement} from './../util.js';

/* Возвращает шаблон разметки меню сайта */
const createMenuTemplate = () => {
  return (
    `<section class="control__btn-wrap">
      <input
        type="radio"
        name="control"
        id="control__new-task"
        class="control__input visually-hidden"
      />
      <label for="control__new-task" class="control__label control__label--new-task"
        >+ ADD NEW TASK</label
      >
      <input
        type="radio"
        name="control"
        id="control__task"
        class="control__input visually-hidden"
        checked
      />
      <label for="control__task" class="control__label">TASKS</label>
      <input
        type="radio"
        name="control"
        id="control__statistic"
        class="control__input visually-hidden"
      />
      <label for="control__statistic" class="control__label"
        >STATISTICS</label
      >
    </section>`
  );
};

/* Экспортирует класс (компонент) меню сайта */
export default class SiteMenu {
  constructor() {
    /* Сохраняет DOM-узел */
    this._element = null;
  }

  /* Возвращает разметку шаблона */
  getTemplate() {
    return createMenuTemplate();
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
