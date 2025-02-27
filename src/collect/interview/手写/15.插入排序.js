function insertion_sort(arr) {
    for(let i = 1; i < arr.length; i++) {
        let j = i
        const target = arr[j]
        while(j > 0 && arr[j - 1] > target) {
            arr[j] = arr[j - 1]
            j--
        }
        arr[j] = target
    }
    return arr
}
console.log(insertion_sort([3, 6, 2, 4, 1]));