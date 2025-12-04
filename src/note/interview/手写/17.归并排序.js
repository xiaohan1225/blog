function merge_sort(arr, L = 0, R = arr.length) {
    if (R - L < 2) {
        return arr
    }
    const mid = L + ((R - L) >> 1)
    merge_sort(arr, L, mid)
    merge_sort(arr, mid, R)
    merge(arr, L, mid, R)
    return arr
}
function merge(arr, L, mid, R) {
    const left = arr.slice(L, mid)
    const right = arr.slice(mid, R)
    left.push(Infinity)
    right.push(Infinity)
    for(let k = L, i = 0, j = 0; k < R; k++) {
        arr[k] = left[i] < right[j] ? left[i++] : right[j++]
    }
}
console.log(merge_sort([3, 6, 2, 4, 1]))