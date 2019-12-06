import SiteMenuComponent from './components/site-menu.js';
import FilterComponent from './components/filter.js';
import BoardComponent from './components/board.js';
import TaskEditComponent from './components/task-edit.js';
import TaskComponent from './components/task.js';
import LoadMoreButtonComponent from './components/load-more-button';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {render} from './util.js';

const TASK_COUNT = 22;
/* После загрузки приложения отображается не более 8 карточек задач.
При нажатии на кнопку "Load More" в список добавляются очередные 8 задач */
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

/* Отрисовывает карточку задачи */
const renderTask = (task) => {
  /* Сохраняет компоненты задачи и формы редактирования задачи */
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  /* Сохраняет кнопку "Edit" в карточке задачи */
  const editButtonElement = taskComponent.getElement().querySelector(`.card__btn--edit`);
  /* Находит элемент формы в форме редактирования задачи */
  const editFormElement = taskEditComponent.getElement().querySelector(`form`);

  /* Заменяет карточку задачи на форму редактирования при клике на кнопку "Edit" */
  editButtonElement.addEventListener(`click`, () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  });

  /* Заменяет форму редактирования на карточку задачи при отправке формы */
  editFormElement.addEventListener(`submit`, () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  });

  render(taskListElement, taskComponent.getElement());
};

/* Сохраняют моки фильтров и задач */
const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);
/* Находит main и  шапку сайта */
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
/* Добавляет в шапку сайта шаблон меню */
render(siteHeaderElement, new SiteMenuComponent().getElement());
/* Добавляют в main шаблоны фильтров и доски задач */
render(siteMainElement, new FilterComponent(filters).getElement());

/* Сохраняет компонент доски задач */
const boardComponent = new BoardComponent();
/* Отрсовывает доску задач */
render(siteMainElement, boardComponent.getElement());

/* Сохраняет контейнер для задач */
const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

/* Количество показанных задач */
let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
/* Добавляет на доску задачи */
tasks.slice(0, showingTasksCount).forEach((task) => renderTask(task));

/* Сохраняет компонент кнопки "Load more" */
const loadMoreButtonComponent = new LoadMoreButtonComponent();
/* Добавляет на доску задач кнопку "Load more" */
render(boardComponent.getElement(), loadMoreButtonComponent.getElement());

loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
  /* Сохраняет количество задач */
  const prevTasksCount = showingTasksCount;
  /* Сохраняет количество задач после нажатия на кнопку */
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  /* Добавляет на доску новые задачи */
  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => renderTask(task));

  /* Если показаны все задачи, удаляет кнопку */
  if (showingTasksCount >= tasks.length) {
    loadMoreButtonComponent.getElement().remove();
    loadMoreButtonComponent.removeElement();
  }
});
