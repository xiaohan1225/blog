function getTenNum1(testArray, n) {
    let result = [];
    for (let i = 0; i < n; i++) {
        const random = Math.floor(Math.random() * testArray.length);
        const cur = testArray[random];
        if (result.includes(cur)) {
            i--;
            continue
        }
        result.push(cur);
    }
    return result;
}

function getTenNum2(testArray, n) {
    const hash = {}
    let result = [];
    for(let i = 0; i < n; i++) {
        const random = Math.floor(Math.random() * testArray.length)
        const cur = testArray[random]
        if (!hash[cur]) {
            hash[cur] = true
            result.push(cur)
        } else {
            i--
        }
    }
    return result;
}

function getTenNum3(testArray, n) {
    const cloneArr = [...testArray];
    let result = [];
    for (let i = 0; i < n; i++) {
        const random = Math.floor(Math.random() * (cloneArr.length - i));
        result.push(cloneArr[random]);
        cloneArr[random] = cloneArr[cloneArr.length - i - 1];
    }
    return result;
}

function getTenNum(testArray, n) {
    const cloneArr = [...testArray];
    let result = [];
    for (let i = 0; i < n; i++) {
        const random = Math.floor(Math.random() * cloneArr.length);
        result.push(cloneArr[random]);
        cloneArr.splice(random, 1)
    }
    return result;
}
const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const resArr = getTenNum(testArray, 14);
console.log(resArr)