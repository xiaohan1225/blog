/**
 *    1 -> 1
      '1' -> 1
      {a: 1} -> 2
      {a: [1, 2]} -> 3
 */
const isObject = (target) => typeof target  === 'object' && target !== null

const getJSONDeep = function (target) {
  let maxDeep = 0
  const getDeep = (target, deep) => {
    if (!isObject(target)) {
      maxDeep = Math.max(maxDeep, deep)
      return
    }
    Object.values(target).forEach(val => getDeep(val, deep + 1))
  }
  getDeep(target, 1)
  return maxDeep
}
console.log(getJSONDeep(1))
console.log(getJSONDeep('1'))
console.log(getJSONDeep({a:1}))
console.log(getJSONDeep({a:[1,2]}))