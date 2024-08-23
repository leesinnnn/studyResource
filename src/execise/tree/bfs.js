const data = require('./const.js')

function breadthFirstSearch(tree) {
  const list = [tree]
  while (list.length !== 0) {
    const currentTree = list.shift()
    console.log(currentTree.type)
    if (currentTree.children && currentTree.children.length) {
      list.push(...currentTree.children)
    }
  }
}

breadthFirstSearch(data.tree)