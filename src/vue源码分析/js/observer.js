function Observer (data) {
  this.data = data;
  this.walk(data);
}

Observer.prototype = {
  walk: function (data) {
    const me = this;
    Object.keys(data).forEach(function (key) {
      me.convert(key, data[key]);
    });
  },
  convert: function (key, val) {
    this.defineReactive(this.data, key, val);
  },

  defineReactive: function (data, key, val) {
    const dep = new Dep();
    // eslint-disable-next-line no-unused-vars
    let childObj = observe(val);

    Object.defineProperty(data, key, {
      enumerable: true, // 可枚举
      configurable: false, // 不能再define
      get: function () {
        if (Dep.target) {
          dep.depend();
        }
        return val;
      },
      set: function (newVal) {
        if (newVal === val) {
          return;
        }
        val = newVal;
        // 新的值是object的话，进行监听
        childObj = observe(newVal);
        // 通知订阅者
        dep.notify();
      }
    });
  }
};

export function observe (value, vm) {
  if (!value || typeof value !== 'object') {
    return;
  }

  return new Observer(value);
};

let uid = 0;

export function Dep () {
  this.id = uid++;
  this.subs = [];
}

Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub);
  },

  depend: function () {
    Dep.target.addDep(this);
  },

  removeSub: function (sub) {
    const index = this.subs.indexOf(sub);
    // eslint-disable-next-line eqeqeq
    if (index != -1) {
      this.subs.splice(index, 1);
    }
  },

  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update();
    });
  }
};

Dep.target = null;
