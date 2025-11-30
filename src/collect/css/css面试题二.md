
## 1、如何实现两栏布局？

两栏布局指的是**左边宽度固定，右边宽度自适应**。

DOM 结构如下：
```html
<body>
  <div class="box">
    <div class="left"></div>
    <div class="right"></div>
  </div>
</body>
```

### 1.1 利用 flex 布局实现

**实现思路**：将父元素设为 flex 布局，左边元素宽度固定，右边元素设为 flex: 1，即自适应。

```css
.box {
  display: flex;
  width: 500px;
  height: 100px;
}
.left {
  width: 200px;
  background: yellow;
}
.right {
  flex: 1;
  background: green;
}
```

**优点**：布局灵活、响应式布局。

**缺点**：IE9 及以下不支持。

### 1.2 利用 float 布局实现

**实现思路**：将左边元素设置为浮动元素 `float: left`，右边元素用 `margin-left`，这样能让右边元素占据父元素剩余宽度。
```css
.box {
  width: 500px;
  height: 100px;
}

.left {
  float: left;
  width: 200px;
  height: 100%;
  background: yellow;
}

.right {
  margin-left: 200px;
  height: 100%;
  background: green;
}
```


**优点**：简单、支持 IE。

**缺点**：浮动易导致问题（如高度塌陷），不适合复杂布局。

### 1.3 利用 Grid 布局实现

**实现思路**：将父元素设为 grid 布局，并设置 `grid-template-columns: 200px 1fr` 即可。
```css
.box {
  display: grid;
  grid-template-columns: 200px 1fr;
  width: 500px;
  height: 100px;
}

.left {
  background: yellow;
}

.right {
  background: green;
}
```

**优点**：二维布局强大，实现多栏布局十分方便。

**缺点**：IE9 及以下不支持，不适合一维布局。

### 1.4 利用 position 绝对定位实现

**实现思路**：父级为相对定位，右边子元素为绝对定位，并同时设置 `left、right、top、bottom` 值，以实现宽高的自动拉伸。

```css
.box {
  position: relative;
  width: 500px;
  height: 100px;
}

.left {
  width: 200px;
  height: 100px;
  background: yellow;
}

.right {
  position: absolute;
  left: 200px;
  right: 0;
  top: 0;
  bottom: 0;
  background: green;
}
```

**优点**：可以精确控制位置。

**缺点**：脱离文档流，响应式差。


## 2、如何实现三栏布局？

三栏布局指的是页面分为三栏，左侧和右侧固定宽度，中间自适应。

DOM 结构如下：
```html
<body>
  <div class="box">
    <div class="left"></div>
    <div class="center"></div>
    <div class="right"></div>
  </div>
</body>
```

### 2.1 利用 flex 布局实现

```css
.box {
  display: flex;
  width: 500px;
  height: 100px;
}

.left {
  width: 100px;
  background: yellow;
}

.center {
  flex: 1;
  background: pink;
}

.right {
  width: 100px;
  background: green;
}
```

### 2.2 利用 float 布局实现

```css
.box {
  width: 500px;
  height: 100px;
}

.left {
  float: left;
  width: 100px;
  height: 100px;
  background: yellow;
}

.center {
  height: 100px;
  margin: 0 100px;
  background: pink;
}

.right {
  float: right;
  width: 100px;
  height: 100px;
  background: green;
}
```

这里需要注意，**中间栏的 DOM 需要放在最后**，以避免浮动元素影响，所以其 DOM 结构如下：

```html
<div class="box">
  <div class="left"></div>
  <div class="right"></div>
  <div class="center"></div>
</div>
```

### 2.3 利用 grid 布局实现

```css
.box {
  display: grid;
  grid-template-columns: 100px 1fr 100px;
  width: 500px;
  height: 100px;
}

.left {
  background: yellow;
}

.center {
  background: pink;
}

.right {
  background: green;
}
```

### 2.4 利用 position 绝对定位实现

```css
.box {
  position: relative;
  width: 500px;
  height: 100px;
}

.left {
  position: absolute;
  left: 0;
  width: 100px;
  height: 100px;
  background: yellow;
}

.center {
  margin: 0 100px;
  height: 100px;
  background: pink;
}

.right {
  position: absolute;
  right: 0;
  top: 0;
  width: 100px;
  height: 100px;
  background: green;
}
```

### 2.5 经典三栏布局之圣杯布局

圣杯布局实现三列布局左右列固定宽度、中间列自适应，其原理是通过**相对定位和负边距**来实现侧边栏的定位。

```html
<style>
  .box {
    padding: 0 150px 0 200px;
  }

  .wrapper::after {
    display: table;
    content: '';
    clear: both;
  }

  .column {
    float: left;
    height: 200px;
  }

  .left {
    width: 200px;
    position: relative;
    margin-left: -100%;
    right: 200px;
    background-color: aqua;
  }

  .center {
    width: 100%;
    background-color: red;
  }

  .right {
    width: 150px;
    margin-right: -150px;
    background-color: green;
  }
</style>
<body>
  <div class="box">
    <!-- 中间列 center 放第一个是为了在文档流中优先渲染，因为 DOM 是从上往下依次渲染的-->
    <div class="center column">center</div>
    <div class="left column">left</div>
    <div class="right column">right</div>
  </div>
</body>
```
### 2.6 经典三栏布局之双飞翼布局
双飞翼布局实现三列布局左右列固定宽度、中间列自适应，其原理是通过使用嵌套的 `div` 元素来实现侧边栏的定位，以及使用**负外边距**将主内容区域撑开。

```html
<style>
  .box {
    background-color: red;
    width: 100%;
  }

  .column {
    float: left;
    height: 200px;
  }

  .center {
    margin: 0 150px 0 200px;
  }

  .left {
    width: 200px;
    background-color: aqua;
    margin-left: -100%;
  }

  .right {
    width: 150px;
    background-color: green;
    margin-left: -150px;
  }
</style>
<body>
  <div class="box column">
    <div class="center">center</div>
  </div>
  <div class="left column">left</div>
  <div class="right column">right</div>
</body>
```


## 3、如何实现水平垂直居中？
### 3.1 文本类可以使用 `line-height` 和 `text-align`
```css
.box {
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
```

### 3.2 使用 flex 布局
```css
.box {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 3.3 使用绝对定位 postion + transform/负 margin

```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

当元素固定宽度时，也可以用 `负 margin` 替代 `transform`。

```css
.parent {
  position: relative;
  width: 200px;
  height: 200px;
  background-color: red;
}

.child {
  width: 50px;
  height: 50px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -25px; /* 自身容器高度的一半 */
  margin-left: -25px; /* 自身容器宽度的一半 */
  background-color: green;
}
```

### 3.4 使用 absolute + margin: auto
```css
.box {
  position: absolute; 
  inset: 0; 
  margin: auto
}

```

### 3.5 使用 Grid 布局
```css
.box {
 display: grid; 
 place-items: center;
}

```

### 3.6 使用 table 布局
```css
.box {
 display: table-cell;
 vertical-align: middle;
}

```


## 4、实现一个三角形

### 4.1 利用 border

在 CSS 中，实现三角形最常见的方法是利用元素的**边框（border）**属性。通过设置元素的宽度和高度为 0，然后调整边框的宽度和颜色，可以形成各种方向的三角形。

```css
.triangle {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;  /* 左透明 */
  border-right: 10px solid transparent; /* 右透明 */
  border-bottom: 30px solid red;       /* 底有颜色，形成向上三角 */
}

```

### 4.2 使用 clip-path

```css
.triangle {
  width: 100px;
  height: 100px;
  background: purple;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);  /* 向上三角 */
}
```

## 5、实现一个扇形

在上面画三角形的基础上，再增加样式 `border-radius: 100%;`即可实现一个扇形。

```css
.sector {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 30px solid red;
  border-radius: 100%; /* 增加 border-radius */
}
```

## 6、实现一个梯形
```css
.box {
  width: 200px;
  height: 60px;
  position: relative;
  margin: 32px auto;
  font-size: 60px;
  text-align: center;
}

.box::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: red;
  transform: perspective(.5em) rotateX(5deg);
}
```

## 7、画一条 0.5px 的线

对于大部分普通屏幕来说，像素是最小的显示单位，因此定义 0.5px 是没有意义的，浏览器遇到小于 1px 时会向上取整渲染 1px，这个是浏览器渲染的局限性。


但是在一些高分辨率屏幕（如 Retina 屏幕）上，1 物理像素点可以被分成多个虚拟像素（比如 2x 屏幕将每个物理像素分为 4 个虚拟像素）。这样的话，1px 的物流像素就等于 2 个虚拟像素，所以 0.5px 也能被渲染出来。

所以对于普通屏幕来说，我们需要做一些兼容方案来渲染出 0.5px 的效果。


我们可以使用 `CSS transform 缩放法` 来实现 0.5px 的线，代码如下：

```css
.line {
  height: 1px;
  background-color: red;
  transform: scaleY(0.5); /* 对高度进行垂直方向的缩放 */
}

```
## 小结

上面是整理的前端面试关于 CSS 高频考察的布局和图形，如有错误或者可以优化的地方欢迎评论区指正。
