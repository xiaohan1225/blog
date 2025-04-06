## 用法

```ts
namespace A {
  let a  = 1;
}
```
外面如果想访问命名空间里的变量，必须先导出，否则会报错

```ts
namespace A {
  export let a  = 1;
}

console.log(A.a);
```

## 命名空间嵌套

```ts
namespace A {
  export namespace B {
    export let a = 1;
  }
}

console.log(A.B.a);
```

## 命名空间合并

```ts
namespace A {
  export let a = 1;
}

namespace A {
  export let b = 2;
}

console.log(A.a, A.b);
```

## 命名空间导出
```ts
// 1.ts
export namespace A {
  export let a = 1;
}
```

```ts
// 2.ts
import { A } from './1';
console.log(A.a);

import a = A.a; // 简写
console.log('a: ', a);
```

## 应用

比如一个工具函数，需要支持跨端，支持`H5`、`Android`、`ios`、`ipad`、`小程序`等。

```ts
namespace h5 {
  export function jump () {

  }
}

namespace android {
  export function jump () {

  }
}

namespace ios {
  export function jump () {

  }
}

namespace ipad {
  export function jump () {

  }
}

namespace miniprogram {
  export function jump () {

  }
}
```