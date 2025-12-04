/**
 * 为什么用setTimeout模拟setInterval
 * setInterval问题
 * 1.在执行的时候可能会跳过指定间隔
 * 2. 多个定时器函数会立即执行
 * 
 * setTimeout好处
 * 1. 在一个定时器执行前不会插入另一个定时器
 * 2. 确保每个函数执行的时间间隔
 */
function myInterval(fn, delay, ...args) {
    let timer = null
    function interval() {
        timer = setTimeout(() => {
            clearTimeout(timer)
            fn.apply(this, args)
            interval(fn, delay, ...args)
        }, delay)
    }
    interval()
    return () => {
        clearTimeout(timer)
    }
}
const fn = (...args) => {
    console.log(args)
}
setInterval(fn, 300, 1,2)

// 反过来使用 setinterval 模拟实现 settimeout 吗？

function mySetTimeout(fn, delay, ...args) {
    const timer = setInterval(() => {
        fn.apply(this, args)
        clearInterval(timer)
    },delay, ...args)
}