import {createMenuTemplate} from './components/site-menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardTemplate} from './components/board.js';
import {createTaskEditTemplate} from './components/task-edit.js';
import {createTaskTemplate} from './components/task.js';
import {createLoadMoreButtonTemplate} from './components/load-more-button';

const TASK_COUNT = 3;

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
render(siteMainElement, createFilterTemplate());
render(siteMainElement, createBoardTemplate());

/* Находит доску задач */
const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

/* Добавляет на доску задач форму редактирования задачи */
render(taskListElement, createTaskEditTemplate());

/* Добавляет на доску задач 3 дефолтных задачи */
new Array(TASK_COUNT)
  .fill(``)
  .forEach(() => render(taskListElement, createTaskTemplate()));

/* Добавляет на доску задач кнопку "Load more" */
render(boardElement, createLoadMoreButtonTemplate());
