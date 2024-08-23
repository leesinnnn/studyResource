// f(n)表示凑齐n最小需要的个数
// f(n) = Math.min(f(n - 1), f(n - 5), f(n - 10))
function getLeastCount(n) {
  const coins = [1, 5, 10]
  if (n < 0) {
    return Infinity
  }
  if (coins.includes(n)) {
    return 1
  }
  return Math.min(getLeastCount(n - 1), getLeastCount(n - 5), getLeastCount(n - 10)) + 1
}