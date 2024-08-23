Promise.prototype.finally = function (onStatusChange) {
  return this.then(
    (res) => {
      onStatusChange();
      return res;
    },
    (reason) => {
      onStatusChange();
      throw reason;
    }
  );
};
