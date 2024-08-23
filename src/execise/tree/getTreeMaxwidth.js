const data = require('./const')

function getTreeMaxWidth(tree, path) {
  const list = [{ layer: 1, tree }];
  while (list.length !== 0) {
    const currentItem = list.shift()
    path.push(currentItem)
    if (currentItem.tree.children && currentItem.tree.children.length) {
      list.push(...currentItem.tree.children.map(child => ({ layer: currentItem.layer + 1, tree: child })))
    }
  }
}

const path = []
getTreeMaxWidth(data.tree, path)
console.log(path)