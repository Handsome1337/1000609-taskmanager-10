import NoTasksComponent from './../components/no-tasks.js';
import SortComponent from './../components/sort.js';
import TasksComponent from './../components/tasks.js';
import TaskEditComponent from './../components/task-edit.js';
import TaskComponent from './../components/task.js';
import LoadMoreButtonComponent from './../components/load-more-button';
import {render, remove, replace} from './../utils/render.js';

/* После загрузки приложения отображается не более 8 карточек задач.
При нажатии на кнопку "Load More" в список добавляются очередные 8 задач */
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

/* Отрисовывает карточку задачи */
const renderTask = (taskListElement, task) => {
  /* Заменяет форму редактирования на карточку задачи */
  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };
  /* Заменяет карточку задачи на форму редактирования */
  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
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

  /* Заменяет карточку задачи на форму редактирования при клике на кнопку "Edit" */
  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    /* Добавляет обработчик нажатия на ESC */
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  /* Заменяет форму редактирования на карточку задачи при отправке формы */
  taskEditComponent.setFormSubmitHandler(() => {
    replaceEditToTask();
    /* Удаляет обработчик нажатия на ESC */
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent);
};

/* Экспортирует контроллёр доски */
export default class BoardController {
  constructor(container) {
    /* Сохраняет элемент, в который будут вставляться компоненты */
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  /* Отрисовывает компоненты в переданном в конструктор элементе */
  render(tasks) {
    const container = this._container.getElement();
    /* Проверяет, все ли задачи выполнены */
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    /* Если все задачи в архиве, отрисовывает сообщение о том, что все задачи выполнены.
    Иначе отрисовывает сортировку, список задач и карточки задач */
    if (isAllTasksArchived) {
      render(container, this._noTasksComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);

    /* Сохраняет контейнер для задач */
    const taskListElement = this._tasksComponent.getElement();

    /* Количество показанных задач */
    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    /* Добавляет на доску задачи */
    tasks.slice(0, showingTasksCount).forEach((task) => renderTask(taskListElement, task));

    /* Добавляет на доску задач кнопку "Load more" */
    render(container, this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(() => {
      /* Сохраняет количество задач */
      const prevTasksCount = showingTasksCount;
      /* Сохраняет количество задач после нажатия на кнопку */
      showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      /* Добавляет на доску новые задачи */
      tasks.slice(prevTasksCount, showingTasksCount)
        .forEach((task) => renderTask(taskListElement, task));

      /* Если показаны все задачи, удаляет кнопку */
      if (showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }
}
