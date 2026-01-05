今天来看一道前端面试的代码输出题。

面试官提供了一段代码，要求给出这段代码运行后的输出结果。

```js
const obj = {
  a: 0,
};

obj['1'] = 0;
obj[++obj.a] = obj.a++;
const values = Object.values(obj);
obj[values[1]] = obj.a;
console.log(obj);

```

让我们来逐行解析下这段代码。

首先，我们定义了一个对象 `obj`，它有一个属性 `a`，值为 `0`。

```js
const obj = {
  a: 0,
};
```

接下来，我们给 `obj` 添加了一个属性 `1`，值为 `0`。

```js
obj['1'] = 0;
```

## 知识点一：

此时 `obj` 的值为：
```json
{
  "1": 0,
  "a": 0,
}
```




JS 对象名只有两种类型，一种是字符创，一种是 `Symbol`，如果你赋值的对象属性不是 `Symbol` 也不是字符串，JS 内部会把它转化为字符串。