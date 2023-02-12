function myPromise (excutor) {
  // 防止this在调用时被篡改
  const instance = this
  instance.state = 'pending'
  instance.data = undefined
  instance.callback = []
  instance.resolved = false

  function resolve (data) {
    // 如果promise已经确定过状态，则不会再改变
    if (instance.state !== 'pending') {
      return
    }
    // 如果resolve的参数是一个promise，那么返回的promise的状态和数据和resolve参数的promise一样
    if (data instanceof myPromise) {
      data.then(
        res => {
          instance.data = res
          instance.state = 'fulfilled'
          instance.callback.forEach(item => item.onResolve())
        },
        err => {
          instance.data = err
          instance.state = 'rejetced'
          instance.callback.forEach(item => item.onReject())
        }
      )
    } else {
      instance.state = 'fulfilled'
      instance.data = data
      instance.callback.forEach(item => item.onResolve())
    }
  }

  function reject (data) {
    if (instance.state !== 'pending') {
      return
    }
    instance.state = 'rejected'
    instance.data = data
    instance.callback.forEach(item => item.onReject())
  }

  try {
    excutor(resolve, reject)
  } catch (e) {
    // 如果promise已经改变了状态
    if (instance.state !== 'pending') {
      return
    }
    instance.state = 'rejected'
    instance.data = e
    this.callback.forEach(item => item.onReject())
  }
}

myPromise.prototype.then = function (onResolve, onReject) {
  const instance = this
  // promise状态确定之后会执行then传入的回调方法，如果promise是成功的或失败的但是没有传入成功或失败的回调，则then方法返回该promise的一个新副本
  const fromatedOnResolve = onResolve || (res => res)
  const formatedOnReject = onReject || (err => { throw err })

  return new myPromise((resolve, reject) => {
    const handleCallback = fn => {
      try {
        setTimeout(() => {
          const result = fn(instance.data)
          // then方法返回的promise由回调执行结果来决定
          // 如果执行回调方法报错，咋返回rejected状态的promise，值为捕获的错误
          // 如果回调的返回值是一个promise，则返回一个复制该promise的新promise
          // 如果回调的返回值不是一个promise，则返回fulfilled状态的promise，值为回调返回值
          if (result instanceof myPromise) {
            result.then(resolve, reject)
          } else {
            resolve(result)
          }
        })
      } catch (e) {
        reject(e)
      }
    }
    instance.state === 'fulfilled'
      ? handleCallback(fromatedOnResolve)
      : instance.state === 'rejected'
        ? handleCallback(formatedOnReject)
        : instance.callback.push({
          onResolve: () => handleCallback(fromatedOnResolve),
          onReject: () => handleCallback(formatedOnReject)
        })
  })
}

// 接收一个数组或者是一个类数组
// 数组里面可以不是promise
// 全部成功返回成功的promise且值为传入的promise的顺序
// 只要有一个失败就返回失败的promise且值为失败的promise的值
myPromise.all = function (args) {
  const promises = [...args].map(promise => myPromise.reslove(promise))
  const promisesValueArr = Array(promises.length)
  return new myPromise((resolve, reject) => {
    promises.forEach((promise, index) => {
      promise.then(
        response => {
          promisesValueArr[index] = response
          if (Object.values(promisesValueArr).length === promisesValueArr.length) {
            resolve(promisesValueArr)
          }
        },
        reason => reject(reason)
      )
    })
  })
}

// 如果参数是promise，则返回一个新的promise副本，否则返回一个成功的promise且值为传入的参数
myPromise.resolve = function (value) {
  return new myPromise((resolve, reject) => {
    if (value instanceof myPromise) {
      value.then(resolve, reject)
    } else {
      resolve(value)
    }
  })
}

// 返回一个失败的promise，值是传入的参数
myPromise.reject = function (value) {
  return new Promise((_, reject) => {
    reject(value)
  })
}

// 当promise的状态变为rejected时执行传入的回调，如果promise的状态是成功则返回当前promise的一个新副本
// 如果传入的回调的执行结果不为promise则返回一个状态为fulfilled的promise，值为回调的执行结果；否则返回promise的一个新副本
myPromise.prototype.catch = function (callback) {
  const instance = this
  return instance.then(null, callback)
}

// 只要promise状态确定，传入的回调函数都会执行
// 如果回调函数的执行结果不是一个失败的promise则返回instance的一个新副本；否则返回失败promise的一个新副本
// fn执行报错，返回失败的promise，值为捕获的错误
myPromise.prototype.finally = function (fn) {
  const instance = this

  return new MyPromise((resolve, reject) => {
    instance.then(
      val => {
        MyPromise.resolve(fn()).then(
          () => resolve(val),
          reason => reject(reason)
        )
      },
      reason => {
        MyPromise.resolve(fn()).then(
          () => reject(reason),
          reason => reject(reason)
        )
      }
    )
  })
}

// 接收一个数组或者是一个类数组
// 数组里面可以不是promise
// 只要有一个pormise状态确定，就返回该promise的新副本
myPromise.race = function (args) {
  const promises = [...args].map(item => Promise.resolve(args))

  return new MyPromise((resolve, reject) => {
    promises.forEach(promise => {
      promise.then(
        result => resolve(result),
        reason => reject(reason)
      )
    })
  })
}

// 接收一个数组或者是一个类数组
// 数组里面可以不是promise
// 等到所有promise的状态都确定之后返回一个fulfilled的promise，value值为一个数组，里面每一个元素是一个对象{ status: 'fulfilled', value: ''} | { status: 'fulfilled', reason: ''}
// 返回值顺序是传入数组的顺序
myPromise.allSettled = function (args) {
  const promises = [...args].map(item => Promise.resolve(args))
  const promiseValueArr = Array(promises.length)

  return new MyPromise((resolve, reject) => {
    promises.forEach((promise, index) => {
      promise.then(
        val => {
          promisesValueArr[index] = { status: 'fulfilled', value: val }
          if (Object.values(promisesValueArr).length === promises.length) {
            resolve(promiseValueArr)
          }
        },
        reason => {
          promisesValueArr[index] = { status: 'rejected', reason }
          if (Object.values(promisesValueArr).length === promises.length) {
            resolve(promiseValueArr)
          }
        }
      )
    })
  })
}

// 接收一个数组或者是一个类数组
// 数组里面可以不是promise
// 全部失败返回rejected的promise且值为传入的promise的顺序
// 只要有一个成功就返回成功的promise，值为成功的promise的值
myPromise.all = function (args) {
  const promises = [...args].map(promise => myPromise.reslove(promise))
  const promisesValueArr = Array(promises.length)
  return new myPromise((resolve, reject) => {
    promises.forEach((promise, index) => {
      promise.then(
        response => {
          resolve(response)
        },
        reason => {
          promisesValueArr[index] = reason
          if (Object.values(promisesValueArr).length === promisesValueArr.length) {
            resolve(promisesValueArr)
          }
        }
      )
    })
  })
}

console.log(Promise.try, '222')
