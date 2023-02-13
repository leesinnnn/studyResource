import { observe } from './observer';
import { Watcher } from './watcher';
import { Compile } from './compile';
function MVVM (options) {
  this.$options = options;
  const data = this._data = this.$options.data;
  const me = this;

  // 数据代理
  // 实现 vm.xxx -> vm._data.xxx
  Object.keys(data).forEach(function (key) {
    me._proxy(key);
  });

  observe(data, this);

  this.$compile = new Compile(options.el || document.body, this);
}

MVVM.prototype = {
  $watch: function (key, cb, options) {
    // eslint-disable-next-line no-new
    new Watcher(this, key, cb);
  },

  _proxy: function (key) {
    const me = this;
    Object.defineProperty(me, key, {
      configurable: false,
      enumerable: true,
      get: function proxyGetter () {
        return me._data[key];
      },
      set: function proxySetter (newVal) {
        me._data[key] = newVal;
      }
    });
  }
};
