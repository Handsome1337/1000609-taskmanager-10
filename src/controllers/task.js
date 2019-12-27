import TaskComponent from './../components/task.js';
import TaskEditComponent from './../components/task-edit.js';
import {RenderPosition, render, replace, remove} from './../utils/render.js';
import {COLOR} from './../const.js';

/* Режим, в котором находится задача */
export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`
};

/* Пустая задача */
export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    'mo': false,
    'tu': false,
    'we': false,
    'th': false,
    'fr': false,
    'sa': false,
    'su': false
  },
  tags: [],
  color: COLOR.BLACK,
  isFavorite: false,
  isArchive: false
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
  render(task, mode) {
    /* Сохраняют состояние компонентов */
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;
    this._mode = mode;

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

    this._taskEditComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._taskEditComponent.getData();
      this._onDataChange(this, task, data);
    });

    this._taskEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, task, null));

    switch (mode) {
      /* Заменяет старый компонент на новый, форму редактирования на карточку задачи.
      Если компонентов не было, добавляет компонент карточки в контейнер */
      case Mode.DEFAULT:
        if (oldTaskComponent && oldTaskEditComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._taskEditComponent, oldTaskEditComponent);
          this._replaceEditToTask();
        } else {
          render(this._container, this._taskComponent);
        }
        break;
      case Mode.ADDING:
        if (oldTaskComponent && oldTaskEditComponent) {
          remove(oldTaskComponent);
          remove(oldTaskEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._taskEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  /* Удаляет компоненты карточки и обработчик закрытия формы редактирования */
  destroy() {
    remove(this._taskEditComponent);
    remove(this._taskComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  /* Меняет расширенную информацию о задаче на карточку задачи */
  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  /* Заменяет форму редактирования на карточку задачи */
  _replaceEditToTask() {
    /* Удаляет обработчик нажатия на ESC */
    document.removeEventListener(`keydown`, this._onEscKeyDown);
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
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
