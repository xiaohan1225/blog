## 最长递增子序列

```js
var getSequence = function (nums) {
  let result = [],
    preIndex = []
  for (let i = 0; i < nums.length; i++) {
    let last = nums[result[result.length - 1]],
      current = nums[i]
    if (current > last || last === undefined) {
      // 当前项大于最后一项
      preIndex[i] = result[result.length - 1]
      result.push(i)
    } else {
      // 当前项小于最后一项，二分查找+替换
      let start = 0,
        end = result.length - 1,
        middle
      while (start < end) { // 重合就说明找到了 对应的值,时间复杂度O(logn)
        middle = Math.floor((start + end) / 2)// 找到中间位置的前一个
        if (nums[result[middle]] > current) {
          end = middle
        } else {
          start = middle + 1
        }
      }

      // 如果相同 或者 比当前的还大就不换了
      if (current < nums[result[start]]) {
        preIndex[i] = result[start - 1] // 要将他替换的前一个记住
        result[start] = i
      }
    }
  }
  // 利用前驱节点重新计算result
  let length = result.length, //总长度
    prev = result[length - 1] // 最后一项
  while (length-- > 0) {// 根据前驱节点一个个向前查找
    result[length] = prev
    prev = preIndex[result[length]]
  }
  return result
}
```