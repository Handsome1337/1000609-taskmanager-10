import Task from './../models/task.js';

/* Перечисление HTTP-методов */
const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

/* Проверяет статус ответа */
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    /* Адрес сервера и авторизация */
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  /* Получает список задач */
  getTasks() {
    return this._load({url: `tasks`})
      .then((response) => response.json())
      .then(Task.parseTasks);
  }

  /* Создаёт задачу */
  createTask(task) {
    return this._load({
      url: `tasks`,
      method: Method.POST,
      body: JSON.stringify(task.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(Task.parseTask);
  }

  /* Обновляет задачу */
  updateTask(id, data) {
    return this._load({
      url: `tasks/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(Task.parseTask);
  }

  /* Удаляет задачу */
  deleteTask(id) {
    return this._load({url: `tasks/${id}`, method: Method.DELETE});
  }

  sync(data) {
    return this._load({
      url: `tasks/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
