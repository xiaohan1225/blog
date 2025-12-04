/**
 * new过程
 * 1. 创建一个新对象，并将新对象原型指向构造函数的prototype
 * 2. 调用构造函数，并且以新对象作为构造函数的this，并传入参数
 * 3. 如果构造函数返回的是引用类型，则返回这个引用，否则返回上一步的调用结果
 * 
 * @param {*} fn 
 * @param {*} args 
 */
function myNew(fn, ...args) {
    const obj = Object.create(fn.prototype)
    const res = fn.apply(fn, args)
    return res instanceof Object ? res : obj
}