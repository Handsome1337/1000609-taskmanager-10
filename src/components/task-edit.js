import {COLORS, DAYS} from '../const.js';
import {formatDate, formatTime} from './../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

/* Проверяет, есть ли повторяющиеся дни */
const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

/* Возвращает разметку выбора цвета */
const createColorsMarkup = (colors, currentColor) => {
  return colors
    .map((color) => {
      return (
        `<input
          type="radio"
          id="color-${color}-4"
          class="card__color-input card__color-input--${color} visually-hidden"
          name="color"
          value="${color}"
          ${currentColor === color ? `checked` : ``}
        />
        <label
          for="color-${color}-4"
          class="card__color card__color--${color}"
          >${color}</label
        >`
      );
    })
    .join(`\n`);
};

/* Возвращает разметку выбора повторяющегося дня */
const createRepeatingDaysMarkup = (days, repeatingDays) => {
  return days
    .map((day) => {
      const isChecked = repeatingDays[day];
      return (
        `<input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}-4"
          name="repeat"
          value="${day}"
          ${isChecked ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-${day}-4"
          >${day}</label
        >`
      );
    })
    .join(`\n`);
};

/* Возвращает разметку управления хештегом */
const createHashtags = (tags) => {
  return Array.from(tags)
    .map((tag) => {
      return (
        `<span class="card__hashtag-inner">
          <input
            type="hidden"
            name="hashtag"
            value="${tag}"
            class="card__hashtag-hidden-input"
          />
          <p class="card__hashtag-name">
            #${tag}
          </p>
          <button type="button" class="card__hashtag-delete">
            delete
          </button>
        </span>`
      );
    })
    .join(`\n`);
};

/* Возвращает шаблон разметки формы редактирования задачи */
const createTaskEditTemplate = (task, options = {}) => {
  const {description, tags, dueDate, color} = task;
  const {isDateShowing, isRepeatingTask, activeRepeatingDays} = options;
  /* Проверяет, просрочена ли дата запланированного выполнения */
  const isExpired = dueDate instanceof Date && dueDate < Date.now();

  /* Проверяет, делать ли кнопку отправки формы недоступной */
  const isBlockSaveButton = (isDateShowing && isRepeatingTask) || (isRepeatingTask && !isRepeating(activeRepeatingDays));
  const date = (isDateShowing && dueDate) ? formatDate(dueDate) : ``;
  const time = (isDateShowing && dueDate) ? formatTime(dueDate) : ``;

  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const tagsMarkup = createHashtags(tags);
  const colorsMarkup = createColorsMarkup(COLORS, color);
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, activeRepeatingDays);
  return (
    `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                </button>

                ${
    isDateShowing ?
      `<fieldset class="card__date-deadline">
                    <label class="card__input-deadline-wrap">
                      <input
                        class="card__date"
                        type="text"
                        placeholder=""
                        name="date"
                        value="${date} ${time}"
                      />
                    </label>
                  </fieldset>`
      : ``
    }

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
                </button>

                ${
    isRepeatingTask ?
      `<fieldset class="card__repeat-days">
                    <div class="card__repeat-days-inner">
                      ${repeatingDaysMarkup}
                    </div>
                  </fieldset>`
      : ``
    }

              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${tagsMarkup}
                </div>

                <label>
                  <input
                    type="text"
                    class="card__hashtag-input"
                    name="hashtag-input"
                    placeholder="Type new hashtag here"
                  />
                </label>
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsMarkup}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit" ${isBlockSaveButton ? `disabled` : ``}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

/* Экспортирует класс (компонент) формы редактирования задачи */
export default class TaskEdit extends AbstractSmartComponent {
  constructor(task) {
    /* Вызывает конструктор родителя */
    super();
    /* Сохраняет переданные в параметр конструктора данные */
    this._task = task;
    /* Устанавливает, показывать ли дату */
    this._isDateShowing = !!task.dueDate;
    /* Устанавливает, есть ли дни повторения задачи */
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    /* Сохраняет массив дней */
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    /* Сохраняет обработчик отправки формы */
    this._submitHandler = null;
    /* Сохраняет календарь */
    this._flatpickr = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  /* Возвращает разметку шаблона */
  getTemplate() {
    return createTaskEditTemplate(this._task, {
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      activeRepeatingDays: this._activeRepeatingDays
    });
  }

  /* Подписывается на события */
  _subscribeOnEvents() {
    const element = this.getElement();

    /* Показывает/скрывает инпут для ввода даты исполнения */
    element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => {
        this._isDateShowing = !this._isDateShowing;

        this.rerender();
      });

    /* Показывает/скрывает дни повторения задачи */
    element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {
        this._isRepeatingTask = !this.isRepeatingTask;

        this.rerender();
      });

    /* Находит fieldset с днями повторения */
    const repeatDaysElement = element.querySelector(`.card__repeat-days`);
    /* Делает день днем повторения, либо наоборот */
    if (repeatDaysElement) {
      repeatDaysElement.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;

        this.rerender();
      });
    }
  }

  /* Добавляет календарь */
  _applyFlatpickr() {
    /* Если календарь был создан ранее, удаляет его */
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    /* Если задача не регулярная, создаёт календарь при клике на поле ввода даты */
    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);
      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._task.dueDate
      });
    }
  }

  /* Восстанавливает обработчики событий после ререндинга */
  recoveryListeners() {
    this.setFormSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  /* Переотрисовывает компонент */
  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  /* Восстанавливает стандартные значения даты и дней повторения задач */
  reset() {
    const task = this._task;

    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);

    this.rerender();
  }

  /* Устанавливает обработчик отправки формы */
  setFormSubmitHandler(handler) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }
}
