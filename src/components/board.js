import AbstractComponent from './abstract-component.js';

/* Возвращает шаблон разметки доски для задач */
const createBoardTemplate = () => {
  return (
    `<section class="board container"></section>`
  );
};

/* Экспортирует класс (компонент) доски задач */
export default class Board extends AbstractComponent {
  /* Возвращает разметку шаблона */
  getTemplate() {
    return createBoardTemplate();
  }
}
