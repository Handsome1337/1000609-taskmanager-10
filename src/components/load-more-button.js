import AbstractComponent from './abstract-component.js';

/* Возвращает шаблон разметки кнопки "Load more" */
const createLoadMoreButtonTemplate = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

/* Экспортирует класс (компонент) кнопки "Load more" */
export default class LoadMoreButton extends AbstractComponent {
  /* Возвращает разметку шаблона */
  getTemplate() {
    return createLoadMoreButtonTemplate();
  }

  /* Устанавливает обработчик клика на кнопку */
  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
