// 1. set
function uniqueArr1(arr) {
    return [...new Set(arr)]
}

// 2. map
function uniqueArr2(arr) {
    const map = new Map()
    // const res = []
    // for(const item of arr) {
    //     if (!map.has(item)) {
    //         map.set(item, item)
    //         res.push(item)
    //     }
    // }
    for(let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (!map.has(item)) {
            map.set(item, item)
        } else {
            arr.splice(i--, 1)
        }
    }
    return arr
}

console.log(uniqueArr2([1,2,1,2,3,4,7]))