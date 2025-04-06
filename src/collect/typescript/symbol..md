## symbol 用法

```js
const sym = Symbol('foo');
const sym2 = Symbol('foo');
console.log(sym === sym2); // false

const a1 = Symbol.for('foo');
const a2 = Symbol.for('foo');
console.log(a1 === a2); // true  Symbol.for() 方法会在全局注册表中创建并返回一个新 symbol。

```

## symbol 应用
可以作为对象的属性名，防止属性名冲突

```js
const sym = Symbol('foo');
const sym1= Symbol('foo');
const obj = {
  [sym]: 'bar'，
  [sym1]: 'foot'，
};
console.log(obj[sym]); // bar
console.log(obj[sym1]); // foot


```

> 注意：Symbol 不能被 for-in 或 Object.keys()、Object.getOwnPropertyNames() 返回，但可以使用 Object.getOwnPropertySymbols() 方法获取对象的所有 symbol 属性名。

```js
const obj = {
  [Symbol('foo')]: 'foo',
  [Symbol('bar')]: 'bar',
  name: '123'
}
console.log(Object.keys(obj));
console.log(Object.getOwnPropertyNames(obj)); // [ 'name' ]
console.log(Object.getOwnPropertySymbols(obj)); // [ Symbol(foo), Symbol(bar) ]
console.log(Reflect.ownKeys(obj)); // [Symbol(foo), Symbol(bar), name]
```

