import SiteMenuComponent, {MenuItem} from './components/site-menu.js';
import FilterController from './controllers/filter.js';
import StatisticsComponent from './components/statistics.js';
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
/* Сохраняют компоненты меню сайта и статистики */
const siteMenuComponent = new SiteMenuComponent();

/* Вычисляют даты для графиков */
const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

const statisticsComponent = new StatisticsComponent({tasks: tasksModel, dateFrom, dateTo});

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

/* Добавляет в main шаблон экрана статистики */
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

/* Сохраняет контроллер доски задач */
const boardController = new BoardController(boardComponent, tasksModel);

/* Отрисовывает компоненты на доску задач */
boardController.render();

/* Устанавливает обработчик смены активного пункта меню */
siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      statisticsComponent.hide();
      boardController.show();
      boardController.createTask();
      break;
    case MenuItem.STATISTICS:
      boardController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TASKS:
      statisticsComponent.hide();
      boardController.show();
      break;
  }
});
