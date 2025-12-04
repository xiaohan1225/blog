// 递归

function flatten1(arr) {
    if (!Array.isArray(arr)) return arr
    return arr.reduce((prev, cur) => {
        return prev.concat(flatten1(cur))
    }, [])
}
// console.log(flatten1([1, 2, [1, [2, 3, [4, 5, [6]]]]]));

// 迭代

function flatten2(arr) {
    const res = []
    const queue = [arr]
    while(queue.length) {
        const item = queue.shift()
        if (Array.isArray(item)) {
            queue.unshift(...item)
        } else {
            res.push(item)
        }
    }
    return res
}
console.log(flatten2([1, 2, [1, [2, 3, [4, 5, [6]]]]]));
