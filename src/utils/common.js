import moment from 'moment';

/* Возвращает отформатированное время */
export const formatTime = (date) => {
  return moment(date).format(`hh:mm A`);
};

/* Возвращает отформатированную дату */
export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

/* Возвращает, является ли задача регулярной */
export const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

/* Возвращает, является ли дата исполнения задачи сегодняшним днем */
export const isOneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `days`) === 0 && dateA.getDate() === dateB.getDate();
};

/* Возвращает, является ли задача просроченной */
export const isOverdueDate = (dueDate, date) => {
  return dueDate < date && !isOneDay(date, dueDate);
};
