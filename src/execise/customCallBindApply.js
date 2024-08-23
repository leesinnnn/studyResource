Function.prototype.call = function(obj, ...args) {
  const fn = this;
  const fnKey = Symbol();
  obj[fnKey] = fn;
  const result = obj[fnKey](...args);
  delete obj[fnKey];
  return result;
}

Function.prototype.apply = function(obj, ...args) {
  const fn = this;
  return fn.call(obj, ...args)
}

Function.prototype.bind = function(obj) {
  const fn = this;
  return function(...args) {
    fn.apply(obj, args)
  }
}

function myNew(fn, ...args) {
  const obj = Object.create(fn.prototype)
  const result = fn.apply(obj, args)
  return Object.prototype.toString.call(result) === '[object Object]' ? result : obj;
}