import {MONTH_NAMES} from '../const.js';
import {formatTime} from './../utils/common.js';
import AbstractComponent from './abstract-component.js';

/* Возвращает разметку хештега */
const createHashtagsMarkup = (hashtags) => {
  return hashtags
    .map((hashtag) => {
      return (
        `<span class="card__hashtag-inner">
          <span class="card__hashtag-name">
            #${hashtag}
          </span>
        </span>`
      );
    })
    .join(`\n`);
};

/* Возвращает разметку кнопки */
const createButtonMarkup = (name, isActive) => {
  return (
    `<button
      type="button"
      class="card__btn card__btn--${name} ${isActive ? `` : `card__btn--disabled`}"
    >
      ${name}
    </button>`
  );
};

/* Возвращает шаблон разметки задачи */
const createTaskTemplate = (task) => {
  const {description, tags, dueDate, color, repeatingDays, isArchive, isFavorite} = task;

  /* Проверяет, просрочена ли дата запланированного выполнения */
  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  /* Устанавливает, показывать ли дату */
  const isDateShowing = !!dueDate;

  /* Вычисляет дату и время */
  const date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = isDateShowing ? `${formatTime(dueDate)}` : ``;
  const hashtags = createHashtagsMarkup(Array.from(tags));
  const editButton = createButtonMarkup(`edit`, true);
  const archiveButton = createButtonMarkup(`archive`, isArchive);
  const favoritesButton = createButtonMarkup(`favorites`, isFavorite);

  const repeatClass = Object.values(repeatingDays).some(Boolean) ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  return (
    `<article class="card card--${color} ${repeatClass} ${deadlineClass}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            ${editButton}
            ${archiveButton}
            ${favoritesButton}
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                    <span class="card__time">${time}</span>
                  </p>
                </div>
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${hashtags}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`
  );
};

/* Экспортирует класс (компонент) задачи */
export default class Task extends AbstractComponent {
  constructor(task) {
    /* Вызывает конструктор родителя */
    super();
    /* Сохраняет переданные в параметр конструктора данные */
    this._task = task;
  }

  /* Возвращает разметку шаблона */
  getTemplate() {
    return createTaskTemplate(this._task);
  }

  /* Устанавливает обработчик клика на кнопку "Edit" */
  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--edit`)
      .addEventListener(`click`, handler);
  }

  /* Устанавливает обработчик клика на кнопку "Archive" */
  setArchiveButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--archive`)
      .addEventListener(`click`, handler);
  }

  /* Устанавливает обработчик клика на кнопку "Favorites" */
  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--favorites`)
    .addEventListener(`click`, handler);
  }
}
