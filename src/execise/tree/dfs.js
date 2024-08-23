const data = require('./const')

function depthFirstSearch(tree) {
  console.log(tree.type)
  if (tree.children && tree.children.length) {
    tree.children.forEach(child => {
      depthFirstSearch(child)
    })
  }
}
depthFirstSearch(data.tree)