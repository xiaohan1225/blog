/**
 * 给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。
请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。
示例 1：

输入：nums = [1,2,0]
输出：3

示例 2：

输入：nums = [3,4,-1,1]
输出：2

示例 3：

输入：nums = [7,8,9,11,12]
输出：1
 */
// O(n²) 空间复杂度O1
const firstMissingPositive1 = (nums) => {
    let i = 0, res = 1
    while(i < nums.length) {
        if (nums[i] === res) {
            res++
            i = 0
        } else {
            i++
        }
    }
    return res
}
const firstMissingPositive2 = (nums) => {
    const set = new Set()
    for(let i = 0; i < nums.length; i++) {
        if (!set.has(nums[i])) {
            set.add(nums[i])
        }
    }
    let res = 1
    while(true) {
        if (!set.has(res)) {
            return res
        }
        res++
    }
}
const firstMissingPositive = (nums) => {
    for(let i = 0; i < nums.length; i++) {
        while (
            nums[i] >= 1 &&
            nums[i] <= nums.length && // 对1~nums.length范围内的元素进行安排
            nums[nums[i] - 1] !== nums[i] // 已经出现在理想位置的，就不用交换
          ) {
            const temp = nums[nums[i] - 1]; // 交换
            nums[nums[i] - 1] = nums[i];
            nums[i] = temp;
          }
    }
    let j = 0
    while(j < nums.length) {
        if (j + 1 === nums[j]) {
            j++
        } else {
            return j + 1
        }
    }
    return nums.length + 1
}


console.log(firstMissingPositive([1,2,0]))
console.log(firstMissingPositive([3,4,-1,1]))
console.log(firstMissingPositive([7,8,9,11,12]))