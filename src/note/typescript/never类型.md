`never` 类型表示**不应该存在的状态或无法达到预期的状态**。

```ts
type A = string & number; // never

function test(): never { // 里面有死循环 表示这个函数有问题，可以用 never 类型来表示
  while(true) {
    
  }
}

function test1(): never { // 该函数一执行就会抛出异常，可以用 never 类型来表示
  throw new Error('test')
}

type B = string | number | void | never; // never 可以和任何类型做联合类型，但会被忽略

type C = '1' | '2';
function test2(s: C) {
  switch(s) {
    case '1':
      break;
    case '2':
      break;
    default:
      // never 表示不会走到这里，做兜底逻辑，如果后续维护 C 类型再增加一个值，这里就会报错
      const check: never = s;
  }
}
```
