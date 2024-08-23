Promise.prototype.catch = function(onReject) {
  return this.then(
    res => res,
    onReject
  )
}