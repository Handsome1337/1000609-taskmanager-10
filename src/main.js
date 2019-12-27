import SiteMenuComponent from './components/site-menu.js';
import FilterController from './controllers/filter.js';
import BoardComponent from './components/board.js';
import BoardController from './controllers/board.js';
import TasksModel from './models/tasks.js';
import {generateTasks} from './mock/task.js';
import {render} from './utils/render.js';

const TASK_COUNT = 22;

/* Сохраняет моки задач */
const tasks = generateTasks(TASK_COUNT);
/* Сохраняет модель задач и записывает в нее задачи */
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

/* Находит main и  шапку сайта */
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
/* Сохраняет компонент меню сайта */
const siteMenuComponent = new SiteMenuComponent();

siteMenuComponent.getElement().querySelector(`.control__label--new-task`)
  .addEventListener(`click`, () => {
    boardController.createTask();
  });

/* Добавляет в шапку сайта шаблон меню */
render(siteHeaderElement, siteMenuComponent);

/* Сохраняет контроллер фильтрации */
const filterController = new FilterController(siteMainElement, tasksModel);
/* Добавляет в main фильтры */
filterController.render();

/* Сохраняет компонент доски задач */
const boardComponent = new BoardComponent();
/* Добавляет в main шаблон доски */
render(siteMainElement, boardComponent);

/* Сохраняет контроллер доски задач */
const boardController = new BoardController(boardComponent, tasksModel);

/* Отрисовывает компоненты на доску задач */
boardController.render();
