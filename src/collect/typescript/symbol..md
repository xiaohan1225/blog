`Symbol` 是 `ES6` 引入的一种新的原始数据类型，表示独一无二的值，唯一且不可变。

`Symbol` 的设计初衷是用来实现对象的私有属性，但实际上并不能真正意义上实现，`JavaScript` 还是提供了一些方法允许程序去访问 `Symbol` 属性，比如 `Reflect.ownKeys()`。

`Symbol` 的主要应用场景是作为对象的属性名。

## Symbol 用法

```js
const sym = Symbol('foo');
const sym2 = Symbol('foo');
console.log(sym === sym2); // false

const a1 = Symbol.for('foo');
const a2 = Symbol.for('foo');
console.log(a1 === a2); // true  Symbol.for() 方法会在全局注册表中创建并返回一个新 symbol。

```

## Symbol 应用
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

## Well-Known Symbol

ES6 规范定义了一批内置的 Symbol，它们叫做 `Well-Known Symbol`，它们的功能是定制对象的特定行为，在 ES6 规范中一共定义了11个 `Well-Known Symbol` 常量。

```js
Symbol.hasInstance // 用于判断某对象是否为某构造器的实例，与 instanceof 运算符的行为相关
Symbol.isConcatSpreadable  // 表示在执行 Array.prototype.concat 时是否允许展开这个对象
Symbol.iterator // 表示该对象的默认迭代器方法，与 for...of 语句的行为相关
Symbol.match // 定义 String.prototype.match 方法的行为
Symbol.replace // 定义 String.prototype.replace 方法的行为
Symbol.search // 定义 String.prototype.search 方法的行为
Symbol.split // 定义 String.prototype.split 方法的行为
Symbol.species // 定义一个用于创建派生对象的构造器函数
Symbol.toPrimitive // 定义一个对象被转为原始类型的操作时应该执行的方法
Symbol.toStringTag // 定义了在对象上调用 Object.prototype.toString 方法时返回的字符串值
Symbol.unscopables // 定义了对象值在 with 语句中的行为
```

