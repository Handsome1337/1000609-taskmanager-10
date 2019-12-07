import SiteMenuComponent from './components/site-menu.js';
import FilterComponent from './components/filter.js';
import BoardComponent from './components/board.js';
import NoTasksComponent from './components/no-tasks.js';
import SortComponent from './components/sort.js';
import TasksComponent from './components/tasks.js';
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
const renderTask = (taskListElement, task) => {
  /* Заменяет форму редактирования на карточку задачи */
  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };
  /* Заменяет карточку задачи на форму редактирования */
  const replaceTaskToEdit = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  /* Функция-обработчик нажатия на ESC */
  const onEscKeyDown = (evt) => {
    /* Проверяет, нажата ли клавиша ESC */
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  /* Сохраняет компоненты задачи и формы редактирования задачи */
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  /* Сохраняет кнопку "Edit" в карточке задачи */
  const editButtonElement = taskComponent.getElement().querySelector(`.card__btn--edit`);
  /* Находит элемент формы в форме редактирования задачи */
  const editFormElement = taskEditComponent.getElement().querySelector(`form`);

  /* Заменяет карточку задачи на форму редактирования при клике на кнопку "Edit" */
  editButtonElement.addEventListener(`click`, () => {
    replaceTaskToEdit();
    /* Добавляет обработчик нажатия на ESC */
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  /* Заменяет форму редактирования на карточку задачи при отправке формы */
  editFormElement.addEventListener(`submit`, () => {
    replaceEditToTask();
    /* Удаляет обработчик нажатия на ESC */
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent.getElement());
};

/* Сохраняют моки фильтров и задач */
const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);
/* Проверяет, все ли задачи выполнены */
const isAllTasksArchived = tasks.every((task) => task.isArchive);
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

/* Если все задачи в архиве, отрисовывает сообщение о том, что все задачи выполнены.
Иначе отрисовывает сортировку, список задач и карточки задач */
if (isAllTasksArchived) {
  render(boardComponent.getElement(), new NoTasksComponent().getElement());
} else {
  render(boardComponent.getElement(), new SortComponent().getElement());
  render(boardComponent.getElement(), new TasksComponent().getElement());

  /* Сохраняет контейнер для задач */
  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  /* Количество показанных задач */
  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

  /* Добавляет на доску задачи */
  tasks.slice(0, showingTasksCount).forEach((task) => renderTask(taskListElement, task));

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
      .forEach((task) => renderTask(taskListElement, task));

    /* Если показаны все задачи, удаляет кнопку */
    if (showingTasksCount >= tasks.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  });
}
