import {createMenuTemplate} from './components/site-menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardTemplate} from './components/board.js';
import {createTaskEditTemplate} from './components/task-edit.js';
import {createTaskTemplate} from './components/task.js';
import {createLoadMoreButtonTemplate} from './components/load-more-button';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';

const TASK_COUNT = 22;
/* После загрузки приложения отображается не более 8 карточек задач.
При нажатии на кнопку "Load More" в список добавляются очередные 8 задач */
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);
/* Находит шапку сайта */
const siteHeaderElement = document.querySelector(`.main__control`);
const siteMainElement = document.querySelector(`.main`);

/* Добавляет в разметку переданный шаблон */
const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

/* Добавляет в шапку сайта шаблон меню */
render(siteHeaderElement, createMenuTemplate());
/* Добавляют в main шаблоны фильтров и доски задач */
render(siteMainElement, createFilterTemplate(filters));
render(siteMainElement, createBoardTemplate());

/* Находит доску задач */
const boardElement = siteMainElement.querySelector(`.board`); // метка
const taskListElement = boardElement.querySelector(`.board__tasks`);

/* Добавляет на доску задач форму редактирования задачи */
render(taskListElement, createTaskEditTemplate(tasks[0]));

/* Количество показанных задач */
let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
/* Добавляет на доску задачи */
tasks.slice(1, showingTasksCount).forEach((task) => render(taskListElement, createTaskTemplate(task)));

/* Добавляет на доску задач кнопку "Load more" */
render(boardElement, createLoadMoreButtonTemplate());

/* Находит кнопку "Load More" */
const loadMoreButton = boardElement.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, () => {
  /* Сохраняет количество задач */
  const prevTasksCount = showingTasksCount;
  /* Сохраняет количество задач после нажатия на кнопку */
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  /* Добавляет на доску новые задачи */
  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => render(taskListElement, createTaskTemplate(task)));

  /* Если показаны все задачи, удаляет кнопку */
  if (showingTasksCount >= tasks.length) {
    loadMoreButton.remove();
  }
});
