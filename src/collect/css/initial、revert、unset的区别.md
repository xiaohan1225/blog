## 前言

每个CSS属性都有一个默认值，比如`background-color`的默认值是`transparent`，`margin`的默认值是`auto`，这些常见的属性我们都知道它们的默认值，但是有些不常见的属性，我们可能就不知道它们的默认值了，那么如何获取这些属性的默认值呢？

这时候就要用上`initial`、`revert`、`unset`这三个**CSS关键字**了。

## initial

`initial` 表示**CSS属性的初始（默认）值**，可以将某个 CSS 属性恢复到其初始状态。

```css
.text {
  color: initial;
}
```

也可以用在 css 属性 `all` 上，将所有的 css 属性恢复到初始状态。 

```css
.box {
  all: initial;
}
```

## revert

`revert` 表示**浏览器样式表中该css属性的默认值**。HTML 在浏览器渲染中，会默认增加一个样式表 `user agent stylesheet`，比如我们都知道 `body`标签会有一个默认 `8px` 的`margin`，这个就是浏览器默认增加的样式