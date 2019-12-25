/* Экспортирует класс (компонент) модели данных */
export default class Tasks {
  constructor() {
    this._tasks = [];
  }

  /* Получает задачи */
  getTasks() {
    return this._tasks;
  }

  /* Записывает задачи */
  setTasks(tasks) {
    this._tasks = Array.from(tasks);
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

    return true;
  }
}
