import TaskComponent from './../components/task.js';
import TaskEditComponent from './../components/task-edit.js';
import {render, replace} from './../utils/render.js';

/* Режим, в котором находится задача */
const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
};

/* Экспортирует контроллёр задачи */
export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    /* Сохраняет элемент, в который будет вставляться задача */
    this._container = container;
    /* Обработчик изменения данных */
    this._onDataChange = onDataChange;
    /* Обработчик открытия расширенной информации о задаче при открытой ранее расширенной информации о другой задаче */
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    /* Сохраняет компоненты задачи и формы редактирования задачи */
    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  /* Отрисовывает карточку задачи */
  render(task) {
    /* Сохраняют состояние компонентов */
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    /* Перезаписывает компоненты задачи и формы редактирования задачи */
    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    /* Заменяет карточку задачи на форму редактирования при клике на кнопку "Edit" */
    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      /* Добавляет обработчик нажатия на ESC */
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    /* onDataChange получает на вход старую задачу и измененную задачу */
    this._taskComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive
      }));
    });

    /* onDataChange получает на вход старую задачу и измененную задачу */
    this._taskComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite
      }));
    });

    /* Заменяет форму редактирования на карточку задачи при отправке формы */
    this._taskEditComponent.setFormSubmitHandler(() => {
      this._replaceEditToTask();
      /* Удаляет обработчик нажатия на ESC */
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    /* Заменяет старый компонент на новый. Если компонентов не было,
    добавляет компонент карточки в контейнер */
    if (oldTaskComponent && oldTaskEditComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._taskEditComponent, oldTaskEditComponent);
    } else {
      render(this._container, this._taskComponent);
    }
  }

  /* Меняет расширенную информацию о задаче на карточку задачи */
  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  /* Заменяет форму редактирования на карточку задачи */
  _replaceEditToTask() {
    /* Восстанавливает стандартные значения даты и дней повторения задач */
    this._taskEditComponent.reset();

    replace(this._taskComponent, this._taskEditComponent);
    /* Устанавливает режим задачи по умолчанию */
    this._mode = Mode.DEFAULT;
  }

  /* Заменяет карточку задачи на форму редактирования */
  _replaceTaskToEdit() {
    /* Устанавливает всем задачам режим по умолчанию */
    this._onViewChange();

    replace(this._taskEditComponent, this._taskComponent);
    /* Выбранной карточке устанавливает режим расширенной информации */
    this._mode = Mode.EDIT;
  }

  /* Функция-обработчик нажатия на ESC */
  _onEscKeyDown(evt) {
    /* Проверяет, нажата ли клавиша ESC */
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
