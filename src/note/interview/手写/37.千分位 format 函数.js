// 接收一个number，返回一个string
function format(number) {
    const [left, right = ''] = (number + '').split('.')
    let count = 0, leftStr = ''
    for(let i = left.length - 1; i >= 0; i--) {
        if (++count === 4) {
            leftStr = left[i] + ',' + leftStr
            count = 1
        } else {
            leftStr = left[i] + leftStr
        }
    }
    count = 0
    let rightStr = ''
    for(let i = 0; i < right.length; i++) {
        if (++count === 4) {
            rightStr = rightStr + ',' + right[i]
            count = 1
        } else {
            rightStr += right[i]
        }
    }
    return leftStr + '.' + rightStr
}
console.log(format(12345.789)); // 12,345.789,0
console.log(format(0.12345678)); // 0.123,456,78
console.log(format(123456)); // 123,456