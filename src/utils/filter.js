import {isRepeating, isOneDay, isOverdueDate} from './common.js';
import {FilterType} from './../const.js';

/* Возвращает выполненные задачи */
export const getArchiveTasks = (tasks) => {
  return tasks.filter((task) => task.isArchive);
};

/* Возвращает невыполненные задачи */
export const getNotArchiveTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchive);
};

/* Возвращает избранные задачи */
export const getFavoriteTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

/* Возвращает просроченные задачи */
export const getOverdueTasks = (tasks, date) => {
  return tasks.filter((task) => {
    const dueDate = task.dueDate;

    /* Если задача регулярная, то она не может быть просроченной */
    if (!dueDate) {
      return false;
    }

    return isOverdueDate(dueDate, date);
  });
};

/* Возвращает регулярные задачи */
export const getRepeatingTasks = (tasks) => {
  return tasks.filter((task) => isRepeating(task.repeatingDays));
};

/* Возвращает задачи с хештегами */
export const getTasksWithHashtags = (tasks) => {
  return tasks.filter((task) => task.tags.size);
};

/* Возвращает сегодняшние задачи */
export const getTasksInOneDay = (tasks, date) => {
  return tasks.filter((task) => isOneDay(task.dueDate, date));
};

/* Возвращает отфильтрованные задачи */
export const getTasksByFilter = (tasks, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.ALL:
      return getNotArchiveTasks(tasks);
    case FilterType.ARCHIVE:
      return getArchiveTasks(tasks);
    case FilterType.FAVORITES:
      return getFavoriteTasks(getNotArchiveTasks(tasks));
    case FilterType.OVERDUE:
      return getOverdueTasks(getNotArchiveTasks(tasks), nowDate);
    case FilterType.REPEATING:
      return getRepeatingTasks(getNotArchiveTasks(tasks));
    case FilterType.TAGS:
      return getTasksWithHashtags(getNotArchiveTasks(tasks));
    case FilterType.TODAY:
      return getTasksInOneDay(getNotArchiveTasks(tasks), nowDate);
  }

  return tasks;
};
