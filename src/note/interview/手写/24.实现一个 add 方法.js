// 题目描述:实现一个 add 方法 使计算结果能够满足如下预期： add(1)(2)(3)()=6 add(1,2,3)(4)()=10

function add(...args) {
  const allArgs = [...args]
  const calc = () => allArgs.reduce((prev, cur) => prev + cur, 0)
  const cb = (...innerArgs) => {
    if (innerArgs.length === 0) {
      return calc(allArgs)
    }
    allArgs.push(...innerArgs)
    return cb
  }
  return cb
}
console.log(add(1)(2)(3)())
console.log(add(1,2,3)(4)())