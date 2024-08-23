Promise.resolve = function (params) {
  return new Promise((resolve, reject) => {
    if (params instanceof Promise) {
      params.then(resolve, reject);
    } else {
      resolve(params);
    }
  });
};
