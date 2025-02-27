function bubble_sort(arr) {
    for(let j = arr.length - 1; j >= 1; j--) {
        for(let i = 1; i <= j; i++) {
            if (arr[i] < arr[i - 1]) {
                swap(arr, i, i - 1)
            }
        }
    }
    return arr
}

function swap(arr, i, j) {
    const t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
}
console.log(bubble_sort([3, 6, 2, 4, 1]));