const isObject = (target) => typeof target === 'object' && target !== null
function cloneDeep(target, map = new WeakMap) {
    if (!isObject(target)) return target
    if (map.get(target)) return map.get(target)
    let cloneObj = null
    if (target instanceof Date) {
        cloneObj = new Date(target)
    } else if (target instanceof RegExp) {
        const newReg = new RegExp(target.source, target.flags)
        newReg.lastIndex = target.lastIndex
        cloneObj = newReg
    }
    if (cloneObj) {
        map.set(target, cloneObj)
        return cloneObj
    }
    cloneObj = Array.isArray(target) ? [] : {}
    map.set(target, cloneObj)
    Reflect.ownKeys(target).forEach((key) => {
        cloneObj[key] = cloneDeep(target[key], map)
    })
    return cloneObj
}

var obj1 = {
    a:1,
    b:{a:2}
};
var obj2 = cloneDeep(obj1);
console.log(obj1);