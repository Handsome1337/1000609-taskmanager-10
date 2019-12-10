import AbstractComponent from './abstract-component.js';

/* Возвращает шаблон разметки сортировки */
const createSortTemplate = () => {
  return (
    `<div class="board__filter-list">
      <a href="#" class="board__filter">SORT BY DEFAULT</a>
      <a href="#" class="board__filter">SORT BY DATE up</a>
      <a href="#" class="board__filter">SORT BY DATE down</a>
    </div>`
  );
};

/* Экспортирует класс (компонент) сортировки */
export default class Sort extends AbstractComponent {
  /* Возвращает разметку шаблона */
  getTemplate() {
    return createSortTemplate();
  }
}
