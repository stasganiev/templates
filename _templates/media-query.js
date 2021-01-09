function doingToMediaQuery(mq) {
  if (mq.matches) {
    // Сделать при выполнении запроса...
  } else {
    // Сделать при не выполнении...
  }
}

// медиа-запрос на языке CSS
let mediaQuery = window.matchMedia('(max-width: 767px) and (orientation: portrait)');

doingToMediaQuery(mediaQuery);
mediaQuery.addListener(doingToMediaQuery);
