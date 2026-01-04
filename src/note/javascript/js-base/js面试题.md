一道前端代码输出题

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

JS 对象名只有两种类型，一种是字符创，一种是 `Symbol`，如果你赋值的对象属性不是 `Symbol` 也不是字符串，JS 内部会把它转化为字符串。