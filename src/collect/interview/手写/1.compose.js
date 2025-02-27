// https://juejin.cn/post/6968713283884974088
function fn1(x) {
    return x + 1;
  }
function fn2(x) {
  return x + 2;
}
function fn3(x) {
  return x + 3;
}
function fn4(x) {
  return x + 4;
}
function compose(...fns) {
    if (!fns.length) return v => v
    if (fns.length === 1) {
        return fn[0]
    }
    return fns.reduce((a, b) => (...args) => a(b(...args)))
}
const a = compose(fn1, fn2, fn3, fn4);
console.log(a(1)); // 1+4+3+2+1=11