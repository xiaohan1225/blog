/**
 * this的隐式绑定
 * @param {*} obj 
 * @param  {...any} args 
 */
Function.prototype.myCall = function (obj = window, ...args) {
    const symbol = Symbol()
    obj[symbol] = this
    const res = obj[symbol](...args)
    delete obj[symbol]
    return res
}

Function.prototype.myApply = function (obj, args) {
    return this.myCall(obj, ...args)
}
Function.prototype.myBind = function (obj, ...outerArgs) {
    const _this = this
    const fn = function (...innerArgs) {
        if (this instanceof _this) {
            return _this.myCall(_this, ...outerArgs, ...innerArgs)
        }
        return _this.myCall(obj, ...outerArgs, ...innerArgs)
    }
    return fn
}
const obj = { a: 1, b: 2 }
function test(...args) {
    console.log(...args)
    setTimeout(() => {
        console.log(this)
    }, 0)
}
console.log(new test.myBind(obj))