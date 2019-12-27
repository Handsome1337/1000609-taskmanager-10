import {FilterType} from './../const.js';
import {getTasksByFilter} from './../utils/filter.js';

/* Экспортирует класс (компонент) модели данных */
export default class Tasks {
  constructor() {
    this._tasks = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  /* Получает все задачи */
  getTasksAll() {
    return this._tasks;
  }

  /* Получает отфильтрованные задачи */
  getTasks() {
    return getTasksByFilter(this._tasks, this._activeFilterType);
  }

  /* Записывает задачи */
  setTasks(tasks) {
    this._tasks = Array.from(tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  /* Устанавливает фильтр */
  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  /* Обновляет задачу */
  updateTask(id, task) {
    /* Сохраняет индекс обновляемой задачи */
    const index = this._tasks.findIndex((it) => it.id === id);

    /* Если задача не найдена, прекращает выполнение функции */
    if (index === -1) {
      return false;
    }

    /* Добавляет обновленную задачу в массив задач */
    this._tasks = [].concat(this._tasks.slice(0, index), task, this._tasks.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  /* Добавляет задачу */
  addTask(task) {
    this._tasks = [].concat(task, this._tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  removeTask(id) {
    /* Сохраняет индекс удаляемой задачи */
    const index = this._tasks.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    /* Удаляет задачу из массива задач */
    this._tasks = [].concat(this._tasks.slice(0, index), this._tasks.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  /* Обработчик изменения активного фильтра */
  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  /* Обработчик изменения данных */
  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  /* Вызывает обработчики */
  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
