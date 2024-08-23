function deepClone(obj) {
  const isComplexType = typeof obj === "object" && obj !== null;
  const types = [Date, RegExp, Set, Map, WeakSet, WeakMap];
  if (types.includes(obj.constructor)) {
    return new obj.constructor(obj);
  }
  const ownDescriptors = Object.getOwnPropertyDescriptors(obj);
  const cloneObj = Object.create(Object.getPrototypeOf(obj), ownDescriptors);
  Reflect.ownKeys(cloneObj).forEach((key) => {
    cloneObj[key] = isComplexType(cloneObj[key])
      ? deepClone(cloneObj[key])
      : cloneObj[key];
  });
  return cloneObj;
}
