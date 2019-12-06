/* Переичление мест вставки элемента */
export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

/* Возвращает отформатированное значение часа или минуты. Если принято значение от 0 до 9, добавляет 0 спереди */
const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

/* Возвращает отформатированное время */
export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  const interval = date.getHours() > 11 ? `pm` : `am`;

  return `${hours}:${minutes} ${interval}`;
};

/* Возвращает созданный элемент из переданного в аргумент шаблона */
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

/* Отрисовывает элемент, добавляя его в разметку */
export const render = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
