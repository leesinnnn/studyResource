const data = require('./const')
function getTreeMaxDepthPath(tree) {
  if (!tree.children || tree.children.length === 0) {
    return [{ type: tree.type }]
  } else {
    const pathList = tree.children.map(child => getTreeMaxDepthPath(child))
    const maxPath = getMaxValue(pathList)
    return [{ type: tree.type }].concat(maxPath)
  }
}

function getMaxValue(list) {
  let maxIndex = 0
  for (let i = maxIndex + 1; i < list.length; i++) {
    if (list[i].length > list[maxIndex].length) {
      maxIndex = i
    }
  }
  return list[maxIndex]
}

console.log(getTreeMaxDepthPath(data.tree))