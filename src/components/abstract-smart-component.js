import AbstractComponent from './abstract-component.js';

/* Экспортирует "умный" абстрактный класс */
export default class AbstractSmartComponent extends AbstractComponent {
  /* Востанавливает обработчики событий после ререндинга */
  recoveryListeners() {
    throw new Error(`Метод recoveryListeners должен быть реализован в наследнике!`);
  }

  /* Ререндерит компонент */
  rerender() {
    /* Сохраняет старый элемент экземпляра */
    const oldElement = this.getElement();
    /* Сохраняет родительский элемент */
    const parent = oldElement.parentElement;

    /* Удаляет ссылку на экземпляр класса */
    this.removeElement();

    /* Сохраняет новый элемент экземпляра */
    const newElement = this.getElement();

    /* Помещает новый элемент вместо старого */
    parent.replaceChild(newElement, oldElement);

    /* Восстанавливает обработчики событий */
    this.recoveryListeners();
  }
}
