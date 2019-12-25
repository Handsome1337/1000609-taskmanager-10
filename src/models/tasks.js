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
  }

  /* Устанавливает фильтр */
  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
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

    this._dataChangeHandlers.forEach((handler) => handler());

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
}
