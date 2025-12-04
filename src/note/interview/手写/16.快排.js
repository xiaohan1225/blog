function quick_sort(arr, L = 0, R = arr.length) {
    if (R - L < 2) {
        return
    }
    const p = partition(arr, L, R)
    quick_sort(arr, L, p)
    quick_sort(arr, p + 1, R)
    return arr
}
function partition(arr, L, R) {
    let m = R - 1
    const pivot = arr[m]
    while(L !== m) {
        if (arr[L] <= pivot) {
            L++
        } else {
            swap(arr, L, --m)
        }
    }
    swap(arr, L, R - 1)
    return L
}
function swap(arr, i, j) {
    const t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
}


function quickSort(arr) {
    if (arr.length < 2) {
        return arr
    }
    const cur = arr[arr.length - 1]
    const left = arr.filter((v, i) => v <= cur && i != arr.length - 1)
    const right = arr.filter((v) => v > cur)
    return [...quickSort(left), cur, ...quickSort(right)]
}
console.log(quickSort([3, 6, 2, 4, 1]));