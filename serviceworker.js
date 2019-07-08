addEventListener('install', installEvent => {
  installEvent.waitUntil(
    caches.open('Johnny')
    .then( JohnnyCache => {
      JohnnyCache.addAll([
       '/offline.html',
       'https://habrastorage.org/getpro/habr/post_images/5be/92e/7eb/5be92e7ebeb7ee4a194b45645538320f.jpg',
       'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
       '/manifest.json',
       '/images/favicon-16x16.png',
       '/images/favicon-32x32.png'
      ]); // конец addAll
    }) // конец open.then
  ); // конец waitUntil
}); // конец addEventListener

// Всегда, когда файл запрашивается
addEventListener('fetch', fetchEvent => {
  const request = fetchEvent.request;
  fetchEvent.respondWith(
    // Сначала попытка запросить его из Сети
    fetch(request)
    .then( responseFromFetch => {
      return responseFromFetch;
    }) // конец fetch.then
    // Если не сработало, то...
    .catch( fetchError => {
      // пытаемся найти в кеше
      caches.match(request)
      .then( responseFromCache => {
        if (responseFromCache) {
         return responseFromCache;
       // если не сработало и...
       } else {
         // это запрос к веб-странице, то...
         if (request.headers.get('Accept').includes('text/html')) {
           // покажите вашу офлайн-страницу
           return caches.match('/offline.html');
         } // 1конец if
       } // конец if/else
     }) // конец match.then
   }) // конец fetch.catch
  ); // конец respondWith
}); // конец addEventListener