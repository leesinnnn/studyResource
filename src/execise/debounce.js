function debounce(fn, time) {
  let timerId;
  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, time);
  };
}
