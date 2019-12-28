import NoTasksComponent from './../components/no-tasks.js';
import SortComponent, {SortType} from './../components/sort.js';
import TasksComponent from './../components/tasks.js';
import LoadMoreButtonComponent from './../components/load-more-button';
import TaskController, {Mode as TaskControllerMode, EmptyTask} from './task.js';
import {render, remove} from './../utils/render.js';

/* После загрузки приложения отображается не более 8 карточек задач.
При нажатии на кнопку "Load More" в список добавляются очередные 8 задач */
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

/* Отрисовывает несколько задач */
const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task, TaskControllerMode.DEFAULT);

    return taskController;
  });
};

/* Экспортирует контроллёр доски */
export default class BoardController {
  constructor(container, tasksModel) {
    /* Сохраняет элемент, в который будут вставляться компоненты */
    this._container = container;
    /* Сохраняет модель задач */
    this._tasksModel = tasksModel;

    this._showedTaskControllers = [];
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._creatingTask = null;

    /* Обработчик изменения данных */
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
  }

  /* Отрисовывает компоненты в переданном в конструктор элементе */
  render() {
    const container = this._container.getElement();
    const tasks = this._tasksModel.getTasks();
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

    this._renderTasks(tasks.slice(0, this._showingTasksCount));

    this._renderLoadMoreButton();
  }

  /* Показывает доску задач */
  show() {
    this._container.show();
  }

  /* Скрывает доску задач */
  hide() {
    this._container.hide();
  }

  /* Создаёт задачу */
  createTask() {
    if (this._creatingTask) {
      return;
    }

    /* Сохраняет контейнер для задач */
    const taskListElement = this._tasksComponent.getElement();
    this._creatingTask = new TaskController(taskListElement, this._onDataChange, this._onViewChange);
    this._creatingTask.render(EmptyTask, TaskControllerMode.ADDING);
  }

  /* Отрисовывает задачи */
  _renderTasks(tasks) {
    /* Сохраняет контейнер для задач */
    const taskListElement = this._tasksComponent.getElement();

    /* Сохраняет новые задачи */
    const newTasks = renderTasks(taskListElement, tasks, this._onDataChange, this._onViewChange);
    /* Сохраняет показанные карточки */
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showedTaskControllers.length;
  }

  /* Удаляет задачи */
  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  /* Отрисовывает кнопку "Load more" */
  _renderLoadMoreButton() {
    remove(this._loadMoreButtonComponent);

    /* Проверяет, показаны ли все задачи */
    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      return;
    }

    const container = this._container.getElement();
    /* Добавляет на доску задач кнопку "Load more" */
    render(container, this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  /* Обновляет задачи */
  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadMoreButton();
  }

  _onLoadMoreButtonClick() {
    /* Сохраняет количество задач */
    const prevTasksCount = this._showingTasksCount;
    const tasks = this._tasksModel.getTasks();

    /* Сохраняет количество задач после нажатия на кнопку */
    this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    /* Отрисовывание новые задачи */
    this._renderTasks(tasks.slice(prevTasksCount, this._showingTasksCount));

    /* Если показаны все задачи, удаляет кнопку */
    if (this._showingTasksCount >= tasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  /* Заменяет неактуальную задачу актуальной */
  _onDataChange(taskController, oldData, newData) {
    if (oldData === EmptyTask) {
      this._creatingTask = null;
      if (newData === null) {
        taskController.destroy();
        this._updateTasks(this._showingTasksCount);
      } else {
        this._tasksModel.addTask(newData);
        taskController.render(newData, TaskControllerMode.DEFAULT);

        const destroyedTask = this._showedTaskControllers.pop();
        destroyedTask.destroy();

        this._showedTaskControllers = [].concat(taskController, this._showedTaskControllers);
        this._showingTasksCount = this._showedTaskControllers.length;
      }
    } else if (newData === null) {
      this._tasksModel.removeTask(oldData.id);
      this._updateTasks(this._showingTasksCount);
    } else {
      const isSuccess = this._tasksModel.updateTask(oldData.id, newData);
      if (isSuccess) {
        taskController.render(newData, TaskControllerMode.DEFAULT);
      }
    }
  }

  /* Устанавливает всем задачам режим по умолчанию */
  _onViewChange() {
    this._showedTaskControllers.forEach((task) => task.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    /* Отсортированные задачи */
    let sortedTasks = [];
    const tasks = this._tasksModel.getTasks();

    /* Сортирует задачи в зависимости от типа сортировки */
    switch (sortType) {
      case SortType.DATE_UP:
        sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        break;
      case SortType.DATE_DOWN:
        sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        break;
      case SortType.DEFAULT:
        sortedTasks = tasks.slice(0, this._showingTasksCount);
        break;
    }

    /* Удаляет неотсортированные задачи */
    this._removeTasks();
    this._renderTasks(sortedTasks);

    /* Если выбрана сортировка по умолчанию, отрисовывает кнопку "Load more", иначе удаляет её */
    if (sortType === SortType.DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._loadMoreButtonComponent);
    }
  }

  /* Обработчик изменения фильтра */
  _onFilterChange() {
    this._updateTasks(SHOWING_TASKS_COUNT_ON_START);
  }
}
