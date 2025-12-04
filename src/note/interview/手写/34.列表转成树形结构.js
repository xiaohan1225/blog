/**
 * [
    {
        id: 1,
        text: '节点1',
        parentId: 0 //这里用0表示为顶级节点
    },
    {
        id: 2,
        text: '节点1_1',
        parentId: 1 //通过这个字段来确定子父级
    }
    ...
]

转成
[
    {
        id: 1,
        text: '节点1',
        parentId: 0,
        children: [
            {
                id:2,
                text: '节点1_1',
                parentId:1
            }
        ]
    }
]
 */

function listToTree(list) {
  const treeIdMap = list.reduce((prev, cur) => {
    prev[cur.id] = cur
    return prev
  }, {})
  const tree = []
  const dfs = (node) => {
    if (node.parentId === 0) {
      tree.push(node)
    } else {
      const parentNode = treeIdMap[node.parentId]
      parentNode.children = (parentNode.children || []).concat(node)
    }
    if (node.children) {
      node.children.forEach(dfs)
    }
  }
  list.forEach(dfs)
  return tree
}
const list = [
  {
      id: 1,
      text: '节点1',
      parentId: 0 //这里用0表示为顶级节点
  },
  {
      id: 2,
      text: '节点1_1',
      parentId: 1 //通过这个字段来确定子父级
  }
]
console.log(listToTree(list))