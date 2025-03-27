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