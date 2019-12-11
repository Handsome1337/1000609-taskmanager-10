import AbstractComponent from './abstract-component.js';

/* Возвращает шаблон разметки сообщения о том, что все задачи выполнены */
const createNoTasksTemplate = () => {
  return (
    `<p class="board__no-tasks">
      Click «ADD NEW TASK» in menu to create your first task
    </p>`
  );
};

/* Экспортирует класс (компонент) сообщения о том, что все задачи выполнены */
export default class NoTasks extends AbstractComponent {
  /* Возвращает разметку шаблона */
  getTemplate() {
    return createNoTasksTemplate();
  }
}
