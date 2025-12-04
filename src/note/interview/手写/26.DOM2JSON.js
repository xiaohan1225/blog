// 请实现 DOM2JSON 一个函数，可以把一个 DOM 节点输出 JSON 的格式
/**
 * <div>
  <span>
    <a></a>
  </span>
  <span>
    <a></a>
    <a></a>
  </span>
</div>

把上述dom结构转成下面的JSON格式

{
  tag: 'DIV',
  children: [
    {
      tag: 'SPAN',
      children: [
        { tag: 'A', children: [] }
      ]
    },
    {
      tag: 'SPAN',
      children: [
        { tag: 'A', children: [] },
        { tag: 'A', children: [] }
      ]
    }
  ]
}
 */
function DOW2JSON(root) {
  const res = {
    tag: root.tagName,
    children: []
  }
  if (root.childNodes) {
    res.children = [...root.childNodes].map(DOW2JSON)
  }
  return res
}