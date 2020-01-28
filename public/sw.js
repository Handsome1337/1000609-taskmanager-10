const CACHE_PREFIX = `taskmanager-cache`;
const CACHE_VER = `v1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

/* Добавляет в кэш статичные файлы после успешной регистрации сервис-воркера*/
self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          `/`,
          `/index.html`,
          `/bundle.js`,
          `/css/normalize.css`,
          `/css/style.css`,
          `/fonts/HelveticaNeueCyr-Bold.woff`,
          `/fonts/HelveticaNeueCyr-Bold.woff2`,
          `/fonts/HelveticaNeueCyr-Medium.woff`,
          `/fonts/HelveticaNeueCyr-Medium.woff2`,
          `/fonts/HelveticaNeueCyr-Roman.woff`,
          `/fonts/HelveticaNeueCyr-Roman.woff2`,
          `/img/add-photo.svg`,
          `/img/close.svg`,
          `/img/sample-img.jpg`,
          `/img/wave.svg`,
        ]);
      })
  );
});

/* Удаляет старые кэши при активации нового сервис-воркера */
self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      /* Получает все названия кэшей */
      caches.keys()
      .then(
          /* Перебирает их и составляет набор промисов на удаление */
          (keys) => Promise.all(
              keys.map(
                  (key) => {
                    /* Удаляет только те кэши, которые начинаются с нашего префикса, но не совпадают по версии */
                    if (key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE_NAME) {
                      return caches.delete(key);
                    }

                    /* Остальные кэши не обрабатывает */
                    return null;
                  }
              ).filter(
                  (key) => key !== null
              )
          )
      )
  );
});

/* Обработчик события загрузки (fetch) */
const fetchHandler = (evt) => {
  const {request} = evt;

  evt.respondWith(
      caches.match(request)
        .then((cacheResponse) => {
          /* Если в кэше нашёлся ответ на запрос (request), возвращает его (cacheResponse) вместо запроса к серверу */
          if (cacheResponse) {
            return cacheResponse;
          }
          /* Если в кэше не нашёлся ответ, повторно вызывает fetch с тем же запросом (request) и возвращает его */
          return fetch(request).then(
              (response) => {
                /* Если ответа нет, или ответ со статусом отличным от 200 OK, или ответ небезопасного типа (не basic),
                тогда просто передаёт ответ дальше, никак не обрабатываем */
                if (!response || response.status !== 200 || response.type !== `basic`) {
                  return response;
                }

                /* Если ответ удовлетворяет всем условиям, клонирует его */
                const clonedResponse = response.clone();

                /* Копию кладёт в кэш */
                caches.open(CACHE_NAME).then((cache) => cache.put(request, clonedResponse));

                /* Оригинал передаёт дальше */
                return response;
              }
          );
        })
  );
};

/* Возвращает ответ из кэша вместо повторного обращения к серверу, если таковой в нём имеется */
self.addEventListener(`fetch`, fetchHandler);
