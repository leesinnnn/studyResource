Promise.race = function(promiseArr) {
  const _promiseArr = promiseArr.map(promise => Promise.resolve(promise))
  return new Promise((resolve, reject) => {
    _promiseArr.forEach(promise => {
      promise.then(resolve, reject)
    })
  })
}