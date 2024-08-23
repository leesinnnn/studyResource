function dfs(tree) {
  console.log(tree.type)
  if (tree.children && tree.children.length) {
    tree.children.forEach(child => dfs(child))
  }
}

function bfs(tree) {
  const list = [tree]
  while (list.length !== 0) {
    const currentTree = list.shift()
    console.log(currentTree.type)
    if (tree.children && tree.children.length) {
      list.push([...tree.children])
    }
  }
}

function getTreeMaxDepth(tree) {
  if (!tree.children || tree.children.lenght === 0) {
    return 1
  } else {
    return Math.max(...tree.children.map(child => getTreeMaxDepth(child))) + 1
  }
}

function getTreeMaxDepthPath(tree) {
  if (!tree.children || tree.children.lenght === 0) {
    return [{ type: tree.type }]
  } else {
    const childTreePathList = tree.children.map(child => getTreeMaxDepthPath(child))
    return [{ type: tree.type }].concat(getListMaxLength(childTreePathList))
  }
}

function getListMaxLength(arr) {
  let maxIndex = 0
  for (let i = maxIndex + 1; i < arr.length; i++) {
    if (arr[i].length > arr[maxIndex].length) {
      maxIndex = i
    }
  }
  return arr[maxIndex]
}

Promise.all = function(promises) {
  const _promises = [...promises].map(promise => Promise.resolve(promise))
  const result = []
  let finishedCount = 0
  return new Promise((resolve, reject) => {
    _promises.forEach(promise => {
      promise.then((data, index) => {
        finishedCount++
        result[index] = data
        if (finishedCount === result.length) {
          resolve(result)
        }
      }).catch(err => {
        reject(err)
      })
    })
  })
}