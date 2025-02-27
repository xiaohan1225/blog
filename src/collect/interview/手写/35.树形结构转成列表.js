/**
 * 
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
转成
[
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
 */

const root = [
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

function treeToList(treeList) {
  if (!treeList.length) return []
  const res = []
  const dfs = (treeList) => {
    treeList.forEach((node) => {
      const children = node.children || []
      delete node.children
      res.push(node)
      dfs(children)
    })
  }
  dfs(treeList)
  return res
}
const tree =  [
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
console.log(treeToList(tree))