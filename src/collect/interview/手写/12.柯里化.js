function currying(fn, ...args) {
    const allArgs = [...args]
    if (allArgs.length >= fn.length) {
        return fn.call(this, args)
    }
    const cb = (...innerArgs) => {
        allArgs.push(...innerArgs)
        if (allArgs.length >= fn.length) {
            return fn.call(this, ...allArgs)
        }
        return cb
    }
    return cb
}

const add = (a, b, c) => a + b + c;
const a = currying(add, 1);
console.log(a(2,3))