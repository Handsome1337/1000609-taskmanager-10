import AbstractComponent from './abstract-component.js';

/* Возвращает шаблон разметки списка задач */
const createTasksTemplate = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

/* Экспортирует класс (компонент) списка задач */
export default class Tasks extends AbstractComponent {
  /* Возвращает разметку шаблона */
  getTemplate() {
    return createTasksTemplate();
  }
}
