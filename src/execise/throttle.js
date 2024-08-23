function throttle(fn, time) {
  let timerId;
  return function(...args) {
    if (timerId) {
      return;
    }
    timerId = setTimeout(() => {
      fn.apply(this, args)
      timerId = null
    }, time)
  }
}