Promise.allSettled = function(promiseArr) {
  const _promiseArr = promiseArr.map(promise => Promise.resolve(promise))
  return new Promise(resolve => {
    const resultArr = []
    let finishedCount = 0
    const onPromiseStatusChange = (index, data, fulfilled = true) => {
      finishedCount++;
      resultArr[index] = {
        status: fulfilled ? 'fufilled' : 'rejected',
        value: data
      }
      if (finishedCount === _promiseArr.length) {
        resolve(resultArr)
      }
    }
    _promiseArr.forEach((promise, index) => {
      promise.then(
        res => onPromiseStatusChange(index, res, true),
        err => onPromiseStatusChange(index, err, false)
      )
    })
  })
}