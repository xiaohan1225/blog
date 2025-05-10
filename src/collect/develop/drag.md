```js
// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
  async bind(el, binding, vnode, oldVnode) {
    await vnode.context.$nextTick();
    const value = binding.value || '.el-dialog__header';
    const dialogHeaderEl = el.querySelector(value)
    console.log('dialogHeaderEl: ', dialogHeaderEl);
    const dragDom = el.querySelector('.el-dialog')
    dialogHeaderEl.style.cursor = 'move'
 
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
 
    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop
 
      // 获取到的值带px 正则匹配替换
      let styL, styT
 
      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }
 
      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX
        const t = e.clientY - disY
 
        // 移动当前元素
        dragDom.style.left = `${l + styL}px`
        dragDom.style.top = `${t + styT}px`
 
        // 将此时的位置传出去
        // binding.value({x:e.pageX,y:e.pageY})
      }
 
      document.onmouseup = function(e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})
 
// v-dialogDragWidth: 弹窗宽度拖大 拖小
Vue.directive('dialogDragWidth', {
  bind(el, binding, vnode, oldVnode) {
    const dragDom = binding.value.$el.querySelector('.el-dialog')
 
    el.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - el.offsetLeft
 
      document.onmousemove = function(e) {
        e.preventDefault() // 移动时禁用默认事件
 
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX
        dragDom.style.width = `${l}px`
      }
 
      document.onmouseup = function(e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})
 
```

## 限制拖动范围
```js
 
// v-dialogDrag: 弹窗拖拽
export const dialogDrag = {
  async bind(el, binding, vnode, oldVnode) {
    await vnode.context.$nextTick();
    const value = binding.value || '.el-dialog__header';
    const dialogHeaderEl = el.querySelector(value)
    const dragDom = el.querySelector('.el-dialog');
    dialogHeaderEl.style.cursor = 'move';
    const dialogBodyEl = el.querySelector('.el-dialog__body');
 
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
 
    let screenLeftDis, screenTopDis, screenRightDis, screenBottomDis;
    dialogHeaderEl.onmousedown = (e) => {
      const { left, top, right, bottom } = dialogBodyEl.getBoundingClientRect();
      screenLeftDis = left;
      screenTopDis = top;
      screenRightDis = document.documentElement.clientWidth - right;
      screenBottomDis =  document.documentElement.clientHeight - bottom;
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop
 
      // 获取到的值带px 正则匹配替换
      let styL, styT
 
      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }
 
      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        let l = e.clientX - disX
        let t = e.clientY - disY
        if (l < 0) {
          // 向左移
          l = l < -screenLeftDis ? -screenLeftDis : l;
        } else {
          // 向右移
          l = l > screenRightDis ? screenRightDis : l;
        }
        if (t < 0) {
          // 向上移
          t = t < -screenTopDis ? -screenTopDis : t;
        } else {
          // 向下移
          t = t > screenBottomDis ? screenBottomDis : t;
        }
        
        // 移动当前元素
        dragDom.style.left = `${l + styL}px`
        dragDom.style.top = `${t + styT}px`
      }
 
      document.onmouseup = function(e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
```

## 窗口改变resize事件的处理

## 前言

本文主要研究，如何实现一个简单的右键菜单拖拽功能。

## 实现自定义右键菜单
html和css部分：
```html
<style>
#customContextMenu {
  display: none;
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}
#customContextMenu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
#customContextMenu li {
  padding: 8px 15px;
  cursor: pointer;
}
#customContextMenu li:hover {
  background: #f0f0f0;
}
</style>
<div id="customContextMenu">
  <ul>
    <li onclick="alert('选项1被点击')">选项1</li>
    <li onclick="alert('选项2被点击')">选项2</li>
    <li onclick="alert('选项3被点击')">选项3</li>
  </ul>
</div>
```
js部分：
```js
document.addEventListener('contextmenu', function (e) {
  e.preventDefault()
  const menu = document.getElementById('customContextMenu')
  menu.style.display = 'block'
  menu.style.left = e.pageX + 'px'
  menu.style.top = e.pageY + 'px'
})

document.addEventListener('click', function () {
  document.getElementById('customContextMenu').style.display = 'none'
})
```

## 1. 实现基础版拖拽功能

```js
const canMove = () => {
  const dragDom = document.querySelector('#customContextMenu')
  dragDom.style.cursor = 'move'
  let clientWidth = document.documentElement.clientWidth,
    clientHeight = document.documentElement.clientHeight
  dragDom.onmousedown = (e) => {
    const { left, top, right, bottom } = dragDom.getBoundingClientRect()
    const disX = e.clientX - dragDom.offsetLeft
    const disY = e.clientY - dragDom.offsetTop

    document.onmousemove = function (e) {
      // 通过事件委托，计算移动的距离
      let l = e.clientX - disX
      console.log('l : ', l)
      let t = e.clientY - disY
      console.log('t : ', t)

      dragDom.style.left = `${l}px`
      dragDom.style.top = `${t}px`
    }

    document.onmouseup = function (e) {
      document.onmousemove = null
      document.onmouseup = null
    }
  }
}
```

## 2. 加上边界限制

```js
document.addEventListener('contextmenu', async function (e) {
  console.log('e: ', e)
  e.preventDefault()
  const menu = document.getElementById('customContextMenu')

  menu.style.display = 'block'
  menu.style.left = e.clientX + 'px'
  menu.style.top = e.clientY + 'px'
  await nextTick()

  const { width, height } = menu.getBoundingClientRect()
  console.log('width: ', width)
  if (e.clientY + height > document.documentElement.clientHeight) {
    console.log('纵向超出了')
    menu.style.top = document.documentElement.clientHeight - height + 'px'
  }
  if (e.clientX + width > document.documentElement.clientWidth) {
    console.log('横向超出了')
    menu.style.left = document.documentElement.clientWidth - width + 'px'
  }
})
```

## 3. 指定范围内的右键菜单

一般是在某些区域内进行自定义的右键菜单，比如画板、表格等区域。一般是在内部管理系统进行使用，
