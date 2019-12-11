/* Перечисление мест вставки элемента */
export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

/* Возвращает созданный элемент из переданного в аргумент шаблона */
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

/* Отрисовывает элемент, добавляя его в разметку */
export const render = (container, component, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
  }
};

/* Удаляет элемент */
export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

/* Заменяет один элемент на другой */
export const replace = (newComponent, oldComponent) => {
  /* Сохраняют родительский и заменяемые элементы */
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  /* Проверяет, что все три элемента существуют */
  const isExistElements = !!(parentElement && newElement && oldElement);

  /* Если родительский элемент содержит в себе заменяемый элемент, элементы заменяются */
  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};
