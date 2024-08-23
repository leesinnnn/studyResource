Promise.all = function(promiseArr) {
  let successCount = 0
  const resultArr = []
  const _promiseArr = promiseArr.map(promise => Promise.resolve(promise))
  return new Promise((resolve, reject) => {
    _promiseArr.forEach((promise, index) => {
      promise
        .then(res => {
          resultArr[index] = res
          successCount++
          if (successCount === _promiseArr.length) {
            resolve(resultArr)
          }
        })
        .catch(reason => reject(reason))
    })
  })
}