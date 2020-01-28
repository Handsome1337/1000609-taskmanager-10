import Api from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import SiteMenuComponent, {MenuItem} from './components/site-menu.js';
import FilterController from './controllers/filter.js';
import StatisticsComponent from './components/statistics.js';
import BoardComponent from './components/board.js';
import BoardController from './controllers/board.js';
import TasksModel from './models/tasks.js';
import {render} from './utils/render.js';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

/* Регистрирует сервис-воркер */
window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      /* Действие в случае успешной регистрации ServiceWorker */
    }).catch(() => {
      /* Действие, в случае ошибки при регистрации ServiceWorker */
    });
});

const STORE_PREFIX = `taskmanager-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/task-manager`;

/* Вычисляют даты для графиков */
const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

/* Сохраняет экземпляры API, провайдера и хранилища */
const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

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
const boardController = new BoardController(boardComponent, tasksModel, apiWithProvider);

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
apiWithProvider.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    boardController.render();
  });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync()
      .then(() => {
        /* Действие, в случае успешной синхронизации */
      })
      .catch(() => {
        /* Действие, в случае ошибки синхронизации */
      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
