
var getSequence1 = function (nums) {
  let result = []
  for (let i = 0; i < nums.length; i++) {
    let last = nums[result[result.length - 1]],
      current = nums[i]
    if (current > last || last === undefined) {
      // 当前项大于最后一项
      result.push(i)
    } else {
      // 当前项小于最后一项，二分查找+替换
      let start = 0,
        end = result.length - 1,
        middle
      while (start < end) {
        middle = Math.floor((start + end) / 2)
        if (nums[result[middle]] > current) {
          end = middle
        } else {
          start = middle + 1
        }
      }
      result[start] = i
    }
  }
  return result
}
// 贪心+2分查找
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
//  0 1 2 3 4 5 6 7 8
// [2,3,1,5,6,8,7,9,4]
// result [1,3,4,6,7,9]
//              0    1  2        3 4 5 6 7 8
// prefix [undefined,0,undefined,1,3,4,4,6,1]
// [2,3,5,6,7,9]
const nums = [2,3,1,5,6,8,7,9,4]
const nums1 = [2,9,3,4]
// console.log(getSequence(nums).map(i => nums[i])) // [ 2, 3, 5, 6, 7, 9 ]
// console.log(getSequence1(nums1).map(i => nums1[i])) // [ 2, 3, 4 ]

// 2,3,1,5,6,8,7,9,4
// 最长递增子序列
function getSequence2(nums) {
  // 表示第I项的最大序列
  const dp = new Array(nums.length).fill(1)
  for(let i = 0; i < nums.length; i++) {
    for(let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }
  }
  return Math.max(...dp)
}