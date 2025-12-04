/**
 * const obj = {
    a: {
            b: 1,
            c: 2,
            d: {e: 5}
        },
    b: [1, 3, {a: 2, b: 3}],
    c: 3
  }

flatten(obj) 结果返回如下
// {
//  'a.b': 1,
//  'a.c': 2,
//  'a.d.e': 5,
//  'b[0]': 1,
//  'b[1]': 3,
//  'b[2].a': 2,
//  'b[2].b': 3
//   c: 3
// }
 */
const isObject = (target) => typeof target === 'object' && target !== null
function flatten(target) {
  if (!isObject(target)) return
  const res = {}
  const dfs = (target, prefix) => {
    if (Array.isArray(target)) {
      for(let i = 0; i < target.length; i++) {
        dfs(target[i], prefix + `[${i}]`)
      }
      return
    }
    if (isObject(target)) {
      Object.entries(target).forEach(([key, val]) => {
        dfs(val, prefix === '' ? key : `${prefix}.${key}`)
      })
      return
    }
    res[prefix] = target
  }
  dfs(target, '')
  return res
}
const obj = {
  a: {
        b: 1,
        c: 2,
        d: {e: 5}
    },
  b: [1, 3, {a: 2, b: 3}],
  c: 3
}
console.log(flatten(obj))