/**
 * 有一组版本号如下['0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5']。
 * 现在需要对其进行排序，排序的结果为 ['4.3.5','4.3.4.5','2.3.3','0.302.1','0.1.1']
 */
function sort(arr) {
    arr.sort((a, b) => {
        const arr1 = a.split('.')
        const arr2 = b.split('.')
        let i = 0
        while(true) {
            const item1 = arr1[i]
            const item2 = arr2[i]
            i++
            if (item1 === undefined || item2 === undefined) {
                return arr2.length - arr1.length
            }
            if (item1 === item2) continue
            return item2 - item1
        }
    })
    return arr
}
console.log(sort(['0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5']))