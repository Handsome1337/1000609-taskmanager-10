import NoTasksComponent from './../components/no-tasks.js';
import SortComponent, {SortType} from './../components/sort.js';
import TasksComponent from './../components/tasks.js';
import LoadMoreButtonComponent from './../components/load-more-button';
import TaskController from './task.js';
import {render, remove} from './../utils/render.js';

/* После загрузки приложения отображается не более 8 карточек задач.
При нажатии на кнопку "Load More" в список добавляются очередные 8 задач */
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

/* Отрисовывает несколько задач */
const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task);

    return taskController;
  });
};

/* Экспортирует контроллёр доски */
export default class BoardController {
  constructor(container) {
    /* Сохраняет элемент, в который будут вставляться компоненты */
    this._container = container;

    this._tasks = [];
    this._showedTaskControllers = [];
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    /* Обработчик изменения данных */
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  /* Отрисовывает компоненты в переданном в конструктор элементе */
  render(tasks) {
    this._tasks = tasks;

    const container = this._container.getElement();
    /* Проверяет, все ли задачи выполнены */
    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);

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

    /* Сохраняет новые задачи */
    const newTasks = renderTasks(taskListElement, this._tasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);
    /* Сохраняет показанные карточки */
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderLoadMoreButton();
  }

  /* Отрисовывает кнопку "Load more" */
  _renderLoadMoreButton() {
    /* Проверяет, показаны ли все задачи */
    if (this._showingTasksCount >= this._tasks.length) {
      return;
    }

    const container = this._container.getElement();
    /* Добавляет на доску задач кнопку "Load more" */
    render(container, this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(() => {
      /* Сохраняет количество задач */
      const prevTasksCount = this._showingTasksCount;
      /* Сохраняет контейнер для кнопки */
      const taskListElement = this._tasksComponent.getElement();

      /* Сохраняет количество задач после нажатия на кнопку */
      this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      /* Сорханяет новые задачи */
      const newTasks = renderTasks(taskListElement, this._tasks.slice(prevTasksCount, this._showingTasksCount), this._onDataChange, this._onViewChange);
      /* Добавляет новые задачи в массиов показанных задач */
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      /* Если показаны все задачи, удаляет кнопку */
      if (this._showingTasksCount >= this._tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  /* Заменяет неактуальную задачу актуальной */
  _onDataChange(taskController, oldData, newData) {
    /* Сохраняет индекс задачи в массиве задач */
    const index = this._tasks.findIndex((it) => it === oldData);

    /* Если задача не найдена, выполнение функции прекращается */
    if (index === -1) {
      return;
    }

    /* Обновляет моки на основе изменившихся данных */
    this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));

    /* Отрисовыает задачу на основе изменившихся данных */
    taskController.render(this._tasks[index]);
  }

  /* Устанавливает всем задачам режим по умолчанию */
  _onViewChange() {
    this._showedTaskControllers.forEach((task) => task.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    /* Отсортированные задачи */
    let sortedTasks = [];

    /* Сортирует задачи в зависимости от типа сортировки */
    switch (sortType) {
      case SortType.DATE_UP:
        sortedTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        break;
      case SortType.DATE_DOWN:
        sortedTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        break;
      case SortType.DEFAULT:
        sortedTasks = this._tasks.slice(0, this._showingTasksCount);
        break;
    }

    const taskListElement = this.TasksComponent.getElement();

    /* Удаляет неотсортированные задачи */
    taskListElement.innerHTML = ``;

    const newTasks = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);
    /* Добавляет на доску отсортированные задачи */
    this._showedTaskControllers = newTasks;

    /* Если выбрана сортировка по умолчанию, отрисовывает кнопку "Load more", иначе удаляет её */
    if (sortType === SortType.DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._loadMoreButtonComponent);
    }
  }
}
