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
