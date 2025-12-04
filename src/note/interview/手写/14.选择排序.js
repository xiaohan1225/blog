function selection_sort(arr) {
    for(let i = 0; i < arr.length; i++) {
        let minIndex = i
        for(let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j
            }
        }
        swap(arr, i, minIndex)
    }
    return arr
}
function swap(arr, i, j) {
    const t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
}
console.log(selection_sort([3, 6, 2, 4, 1]));