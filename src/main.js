import SiteMenuComponent from './components/site-menu.js';
import FilterComponent from './components/filter.js';
import BoardComponent from './components/board.js';
import BoardController from './controllers/board.js';
import TasksModel from './models/tasks.js';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {render} from './utils/render.js';

const TASK_COUNT = 22;

/* Сохраняют моки фильтров и задач */
const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);
/* Сохраняет модель задач и записывает в нее задачи */
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

/* Находит main и  шапку сайта */
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
/* Добавляет в шапку сайта шаблон меню */
render(siteHeaderElement, new SiteMenuComponent());
/* Добавляют в main шаблоны фильтров */
render(siteMainElement, new FilterComponent(filters));

/* Сохраняет компонент доски задач */
const boardComponent = new BoardComponent();
/* Добавляет в main шаблон доски */
render(siteMainElement, boardComponent);

/* Сохраняет контроллёр доски задач */
const boardController = new BoardController(boardComponent, tasksModel);

/* Отрисовывает компоненты на доску задач */
boardController.render();
