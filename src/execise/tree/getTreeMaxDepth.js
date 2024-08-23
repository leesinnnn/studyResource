const data = require('./const.js')
function getTreeMaxDepth(tree) {
  if (!tree.children || tree.children.length === 0) {
    return 1
  }
  return Math.max(...tree.children.map(child => getTreeMaxDepth(child))) + 1
}

console.log(getTreeMaxDepth(data.tree))