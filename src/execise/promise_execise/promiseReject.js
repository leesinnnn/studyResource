Promise.reject = function(value) {
  return new Promise((_, reject) => {
    if (value instanceof Promise) {
      value.then(reject, reject)
    } else {
      reject(value)
    }
  })
}