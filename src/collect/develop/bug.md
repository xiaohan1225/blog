## 重复点击问题

```js
function onClick() {
  const { query } = this.$route;
  query.a = 1;
  this.$router.push({ name: 'home', query });
}
```

如果用户点击了两次，`onClick`事件会执行两次，两次取的`query`会不一样，第二次取的`query`是第一次`onClick`触发时，调用`$router.push`传入的`query`。

## dom diff 报错

bug产生：先进入课时播放页，然后判断用户没买这个们课程，然后跳转到购买页，页面报错，用户在页面上点击购买按钮无反应，影响了学员正常购课。

报错原因：
- 我们系统中有两个弹窗，一个是插屏元素，一个是【正在直播】弹窗，两个弹框是邻近的兄弟节点关系，先访问页面A，显示插屏元素，然后访问页面B，也需要显示插屏元素，而此时【正在直播】弹窗已经被挂在到body下面，Vue在进行insertBefore时找不到参考元素，报错。

报错信息：

- <font color='red'>[Vue warn]: Error in nextTick: "NotFoundError: Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node."</font>
- <font color='red'>DOMException: Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.</font>

报错条件：
1. 一个元素下面是一个弹窗，而弹窗被挂载到body下面，两个元素都用v-if控制
2. 元素和弹窗需要同时重新渲染，在页面跳转时，元素的v-if为false，本来弹框的v-if应该也为false的，假设控制元素的变量是a，控制弹框的元素是b，b是个计算属性，不仅依赖a还依赖了c，但此时由于代码先后顺序的原因，由于只收集到了c的依赖没收集到a的依赖，所以当a改为false时，弹框的v-if还是为true，当页面请求结束后，此时该元素和弹框的v-if都为true。

oldVnode：  Aside组件 comment注释节点 dialog组件 open-app组件
newVnode：Aside组件 插屏弹框组件  comment注释节点 open-app组件

排查过程：
1. 利用 `vscode` 的调试能力，断点调试vue项目
2. 排查到是 `dom diff` 那里报错了。

收获点：
1. 更加熟悉了 `dom diff`原理，学习原理得到了正反馈，进而去学习了 `vue3` 整个的源码。
2. `debugger`能力，学会了如何在项目中调试`vue`源码。



