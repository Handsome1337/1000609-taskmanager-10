import {COLORS} from '../const.js';

/* Описания задач */
const descriptionItems = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];

/* Дни недели повтора задачи */
const defaultRepeatingDays = {
  'mo': false,
  'tu': false,
  'we': false,
  'th': false,
  'fr': false,
  'sa': false,
  'su': false
};

/* Список хештегов */
const tags = [
  `homework`,
  `theory`,
  `practice`,
  `intensive`,
  `keks`
];

/* Возвращает случайное число от min до max (не включая max) */
const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

/* Возвращает случайный элемент массива */
const getRandomArrayImem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

/* Возвращает случайную дату ± неделя от текущекй даты */
const getRandomDate = () => {
  const targetDate = new Date();
  /* Определяет, будет ли дата позже текущей даты или раньше */
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 7);

  /* Устанавливает новую дату */
  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

/* Возвращает случайные дни повтора задачи */
const generateRepeatingDays = () => {
  return Object.assign({}, defaultRepeatingDays, {
    'mo': Math.random() > 0.5
  });
};

/* Возвращает от 0 до 3 случайных хештегов */
const generateTags = (tagsList) => {
  return tagsList.filter(() => Math.random() > 0.5).slice(0, 3);
};

/* Возвращает мок-объект задачи */
const generateTask = () => {
  /* Поле с датой запланированного выполнения может быть не заполнено */
  const dueDate = Math.random() > 0.5 ? null : getRandomDate();

  return {
    description: getRandomArrayImem(descriptionItems),
    dueDate,
    /* Следующую строку не понял */
    repeatingDays: dueDate ? defaultRepeatingDays : generateRepeatingDays(),
    tags: new Set(generateTags(tags)),
    color: getRandomArrayImem(COLORS),
    isFavorite: Math.random() > 0.5,
    isArchive: Math.random() > 0.5
  };
};

/* Возвращает массив моков-задач */
const generateTasks = (count) => {
  return new Array(count).fill(``).map(generateTask);
};

export {generateTask, generateTasks};
