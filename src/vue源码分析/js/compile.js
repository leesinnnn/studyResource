function Compile (el, vm) {
  this.$vm = vm;
  this.$el = this.isElementNode(el) ? el : document.querySelector(el);

  if (this.$el) {
    this.$fragment = this.node2Fragment(this.$el);
    this.init();
    this.$el.appendChild(this.$fragment);
  }
}

Compile.prototype = {
  node2Fragment: function (el) {
    const fragment = document.createDocumentFragment();
    let child;

    // 将原生节点拷贝到fragment
    while (child = el.firstChild) {
      fragment.appendChild(child);
    }

    return fragment;
  },

  init: function () {
    this.compileElement(this.$fragment);
  },

  compileElement: function (el) {
    const childNodes = el.childNodes;
    const me = this;

    [].slice.call(childNodes).forEach(function (node) {
      const text = node.textContent;
      const reg = /\{\{(.*)\}\}/;

      if (me.isElementNode(node)) {
        me.compile(node);
      } else if (me.isTextNode(node) && reg.test(text)) {
        me.compileText(node, RegExp.$1);
      }

      if (node.childNodes && node.childNodes.length) {
        me.compileElement(node);
      }
    });
  },

  compile: function (node) {
    const nodeAttrs = node.attributes;
    const me = this;

    [].slice.call(nodeAttrs).forEach(function (attr) {
      const attrName = attr.name;
      if (me.isDirective(attrName)) {
        const exp = attr.value;
        const dir = attrName.substring(2);
        // 事件指令
        if (me.isEventDirective(dir)) {
          compileUtil.eventHandler(node, me.$vm, exp, dir);
          // 普通指令
        } else {
          compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
        }

        node.removeAttribute(attrName);
      }
    });
  },

  compileText: function (node, exp) {
    compileUtil.text(node, this.$vm, exp);
  },

  isDirective: function (attr) {
    return attr.indexOf('v-') == 0;
  },

  isEventDirective: function (dir) {
    return dir.indexOf('on') === 0;
  },

  isElementNode: function (node) {
    return node.nodeType == 1;
  },

  isTextNode: function (node) {
    return node.nodeType == 3;
  }
};

// 指令处理集合
var compileUtil = {
  text: function (node, vm, exp) {
    this.bind(node, vm, exp, 'text');
  },

  html: function (node, vm, exp) {
    this.bind(node, vm, exp, 'html');
  },

  model: function (node, vm, exp) {
    this.bind(node, vm, exp, 'model');

    const me = this;
    let val = this._getVMVal(vm, exp);
    node.addEventListener('input', function (e) {
      const newValue = e.target.value;
      if (val === newValue) {
        return;
      }

      me._setVMVal(vm, exp, newValue);
      val = newValue;
    });
  },

  class: function (node, vm, exp) {
    this.bind(node, vm, exp, 'class');
  },

  bind: function (node, vm, exp, dir) {
    const updaterFn = updater[dir + 'Updater'];

    updaterFn && updaterFn(node, this._getVMVal(vm, exp));

    new Watcher(vm, exp, function (value, oldValue) {
      updaterFn && updaterFn(node, value, oldValue);
    });
  },

  // 事件处理
  eventHandler: function (node, vm, exp, dir) {
    const eventType = dir.split(':')[1];
    const fn = vm.$options.methods && vm.$options.methods[exp];

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false);
    }
  },

  _getVMVal: function (vm, exp) {
    let val = vm._data;
    exp = exp.split('.');
    exp.forEach(function (k) {
      val = val[k];
    });
    return val;
  },

  _setVMVal: function (vm, exp, value) {
    let val = vm._data;
    exp = exp.split('.');
    exp.forEach(function (k, i) {
      // 非最后一个key，更新val的值
      if (i < exp.length - 1) {
        val = val[k];
      } else {
        val[k] = value;
      }
    });
  }
};

var updater = {
  textUpdater: function (node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value;
  },

  htmlUpdater: function (node, value) {
    node.innerHTML = typeof value === 'undefined' ? '' : value;
  },

  classUpdater: function (node, value, oldValue) {
    let className = node.className;
    className = className.replace(oldValue, '').replace(/\s$/, '');

    const space = className && String(value) ? ' ' : '';

    node.className = className + space + value;
  },

  modelUpdater: function (node, value, oldValue) {
    node.value = typeof value === 'undefined' ? '' : value;
  }
};
