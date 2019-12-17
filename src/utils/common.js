import moment from 'moment';

/* Возвращает отформатированное время */
export const formatTime = (date) => {
  return moment(date).format(`hh:mm A`);
};

/* Возвращает отформатированную дату */
export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};
