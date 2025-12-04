/**
 * 
{
  tag: 'DIV',
  attrs:{
    id:'app'
  },
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

把上诉虚拟Dom转化成下方真实Dom
<div id="app">
  <span>
    <a></a>
  </span>
  <span>
    <a></a>
    <a></a>
  </span>
</div>
 */

function createElm(vnode) {
  if (typeof vnode === 'number') {
    return String(vnode)
  }
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode)
  }
  const el = document.createElement(vnode.tag)
  if (vnode.attrs) {
    Object.entries(vnode.attrs).forEach(([attrName, attrValue]) => {
      el.setAttribute(attrName, attrValue)
    })
  }
  if (vnode.children) {
    vnode.children.forEach((child) => {
      el.appendChild(createElm(child))
    })
  }
  return el
}