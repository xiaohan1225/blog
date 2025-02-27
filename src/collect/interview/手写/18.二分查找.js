// 如何确定一个数在一个有序数组中的位置
function binary_search(arr, target) {
    let L = 0, R = arr.length - 1
    while(L <= R) {
        const mid = L + ((R - L) >> 1)
        if (arr[mid] === target) {
            return mid
        } else if (arr[mid] > target) {
            R = mid - 1
        } else {
            L = mid + 1
        }
    }
    return -1
}
const dataArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const position = binary_search(dataArr, 6);
console.log(position)