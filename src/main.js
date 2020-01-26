import API from './api.js';
import SiteMenuComponent, {MenuItem} from './components/site-menu.js';
import FilterController from './controllers/filter.js';
import StatisticsComponent from './components/statistics.js';
import BoardComponent from './components/board.js';
import BoardController from './controllers/board.js';
import TasksModel from './models/tasks.js';
import {render} from './utils/render.js';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/task-manager`;

/* Вычисляют даты для графиков */
const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

/* Сохраняет экземпляр API */
const api = new API(END_POINT, AUTHORIZATION);

/* Сохраняет модель задач и записывает в нее задачи */
const tasksModel = new TasksModel();

/* Находит main и  шапку сайта */
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
/* Сохраняют компоненты меню сайта и статистики */
const siteMenuComponent = new SiteMenuComponent();
const statisticsComponent = new StatisticsComponent({tasks: tasksModel, dateFrom, dateTo});
/* Сохраняет контроллер фильтрации */
const filterController = new FilterController(siteMainElement, tasksModel);

/* Сохраняет компонент доски задач */
const boardComponent = new BoardComponent();
/* Сохраняет контроллер доски задач */
const boardController = new BoardController(boardComponent, tasksModel, api);

/* Добавляет в шапку сайта шаблон меню */
render(siteHeaderElement, siteMenuComponent);

/* Добавляет в main фильтры */
filterController.render();

/* Добавляет в main шаблон доски */
render(siteMainElement, boardComponent);

/* Добавляет в main шаблон экрана статистики */
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

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

/* После получения данных отрисовывает компоненты на доску задач */
api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    boardController.render();
  });
