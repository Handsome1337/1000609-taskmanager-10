import {createElement} from './../utils/render.js';

const HIDDEN_CLASS = `visually-hidden`;

/* Экспортирует абстрактный класс */
export default class AbstractComponent {
  constructor() {
    /* Бросает исключение, если объект был создан напрямую из класса */
    if (new.target === AbstractComponent) {
      throw new Error(`Нельзя создать экземпляр абстрактного класса, от него можно только наследоваться.`);
    }

    /* Сохраняет DOM-узел */
    this._element = null;
  }

  /* Бросает исключение, если объект был создан без метода getTemplate */
  getTemplate() {
    throw new Error(`Метод getTemplate не реализован у наследника`);
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

  /* Показывает компонент */
  show() {
    if (this._element) {
      this._element.classList.remove(HIDDEN_CLASS);
    }
  }

  /* Скрывает компонент */
  hide() {
    if (this._element) {
      this._element.classList.add(HIDDEN_CLASS);
    }
  }
}
