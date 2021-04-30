// 手写一个自己的promise
function MyPromise(excutor) {
  const self = this
  this.data = ''
  this.status = 'pendding'
  // 存入then回调的函数，每一个是一个对象
  this.callbacks = []

  function resolve(value) {
    if (self.status !== 'pendding') return
    self.data = value
    self.status = 'resolved'
    self.callbacks.forEach(callbackObj => {
      callbackObj.onResolve()
    })
  }

  function reject(value) {
    if (self.status !== 'pendding') return
    self.data = value
    self.status = 'rejected'
    self.callbacks.forEach(callbackObj => {
      callbackObj.onReject()
    })
  }

  excutor(resolve, reject)
}

MyPromise.prototype.then = function (onResolve, onReject) {
  const self = this
  onResolve = onResolve ? onResolve : value => value
  onReject = onReject ? onReject : reson => { throw reson }

  return new MyPromise((resolve, reject) => {

    function handle(callback) {
      setTimeout(() => {
        try {
          const result = callback(self.data)
          if (result instanceof MyPromise) {
            result.then(resolve, reject)
          } else {
            resolve(result)
          }
        } catch (err) {
          reject(err)
        }
      }, 0)
    }

    self.status === 'resolved' ? handle(onResolve) :
      self.status === 'rejected' ? handle(onReject) :
        self.callbacks.push({
          onResolve: () => handle(onResolve),
          onReject: () => handle(onReject)
        })
  })
}

MyPromise.prototype.catch = function (onReject) {
  return this.then(null, onReject)
}

MyPromise.resolve = function (value) {

  return new MyPromise((resolve, reject) => {
    if (value instanceof MyPromise) {
      value.then(resolve, reject)
    } else {
      resolve(value)
    }
  })

}

MyPromise.reject = function (reson) {
  return new MyPromise((resolve, reject) => {
    reject(reson)
  })
}

// 传入的参数数组里面的所有promise变为resolve状态才执行then成功的回调，并且value是按照传入的数组里promise的顺序返回的；只要有一个reject就执行then失败的回调
// 该函数接收一个数组或者是一个类数组
// 数组里面的每个成员可以不是promise
MyPromise.all = function (promiseArr) {
  // 将不是promise的变成promise
  promiseArr = [...promiseArr].map(item => MyPromise.resolve(item))

  return new MyPromise((resolve, reject) => {
    const promiseValuesArr = Array(promiseArr.length)
    promiseArr.forEach((promise, index) => {
      promise.then(value => {
        promiseValuesArr[index] = value
        if (Object.values(promiseValuesArr).length === promiseArr.length) {
          resolve(promiseValuesArr)
        }
      }, reason => {
        reject(reason)
      })
    })
  })
}

// 只要传入的数组里面任何一个promise状态发生改变就会得到相应的值
MyPromise.race = function (promiseArr) {
  promiseArr = [...promiseArr].map(item => MyPromise.resolve(item))

  return new Promise((resolve, reject) => {
    promiseArr.forEach(promise => {
      promise.then(value => {
        resolve(value)
      }, reson => {
        reject(reson)
      })
    })
  })
}

MyPromise.allSettled = function (arr) {
  const promiseArr = arr.map(item => MyPromise.resolve(item))
  const resultValue = new Array(promiseArr.length)

  return new MyPromise((resolve, reject) => {

    function handle(value, index, status) {

      resultValue[index] = {
        status
      }

      if (status === 'fulfilled') {
        resultValue[index].value = value
      } else {
        resultValue[index].reson = value
      }

      if (Object.keys(resultValue).length === promiseArr.length) {
        resolve(resultValue)
      }
    }

    promiseArr.forEach((promise, index) => {
      promise.then((value) => {
        handle(value, index, 'fulfilled')
      }, (reson) => {
        handle(reson, index, 'rejected')
      })
    })

  })
}

MyPromise.any = function (arr) {
  const promiseArr = arr.map(item => Promise.resolve(item))
  const promiseArrLength = promiseArr.length
  const resultArr = new Array(promiseArrLength)
  return new MyPromise((resolve, reject) => {
    promiseArr.forEach((promise, index) => {
      promise.then(value => {
        resolve(value)
      }, reson => {
        resultArr[index] = reson
        if (Object.keys(resultArr).length === promiseArrLength) {
          reject(resultArr)
        }
      })
    })
  })
}

