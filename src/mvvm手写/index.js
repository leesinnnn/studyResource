function observe (data) {
  if (typeof data !== 'object') return
  Object.keys(data).forEach(key => {
    const dep = new Dep()
    const value = data[key]
    observe(value)
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get: function () {
        if (Dep.target) {
          Dep.target.append(dep)
        }
        return value
      },
      set: function (newValue) {
        if (newValue === value) return
        dep.notify()
        value = newValue
      }
    })
  })
}

let id = 0

function Dep () {
  this.watchers = []
  this.id = id++
}

Dep.prototype = {

  addWatcher (watcher) {
    this.watchers.push(watcher)
  },

  removeWatcher (watcher) {
    const index = this.watchers.indexOf(watcher)
    this.watchers.splice(index, 1)
  },

  notify () {
    this.watchers.forEach(watcher => watcher.update())
  }
}

Dep.target = null

function Watcher (data, exp) {
  this.depsId = {}
  this.value = this.getValue(data, exp)
}

Watcher.prototype = {
  append (dep) {
    if (this.depsId[dep.id]) return
    dep.addWatcher(this)
    this.depsId[dep.id] = dep
  },
  getValue (data, exp) {
    Dep.target = this
    const expArr = exp.split('.')
    let value = data
    expArr.forEach(key => {
      value = value[key]
    })
    Dep.target = null
    return value
  }
}
