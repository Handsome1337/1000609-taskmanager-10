import {createElement} from './../util.js';

/* Возвращает шаблон разметки списка задач */
const createTasksTemplate = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

/* Экспортирует класс (компонент) списка задач */
export default class Tasks {
  constructor() {
    /* Сохраняет DOM-узел */
    this._element = null;
  }

  /* Возвращает разметку шаблона */
  getTemplate() {
    return createTasksTemplate();
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
