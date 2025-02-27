// JS 实现一个带并发限制的异步调度器 Scheduler，保证同时运行的任务最多有两个

// function scheduler1(promises, limit) {
//     const pool = promises.slice(0, limit).map(({delay, str}, index) => {
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 console.log(str)
//                 resolve(index)
//             }, delay)
//         })
//     })
//     let p = Promise.race(pool)
//     for(let i = limit; i < promises.length; i++) {
//         p = p.then((index) => {
//             pool[index] = new Promise((resolve) => {
//                 const { delay, str } = promises[i]
//                 setTimeout(() => {
//                     console.log(str)
//                     resolve(index)
//                 }, delay)
//             })
//             return Promise.race(pool)
//         })
//     }
//     return p
// }

const time = Date.now();
class Scheduler {
    constructor(limit) {
        this.tasks = []
        this.limit = limit
    }
    start() {
        // 创建一个只有 limit 个并发量的 任务池
        const pool = this.tasks.slice(0, this.limit).map(({ delay, name }, index) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log(name)
                    // 这里把当前任务在任务池中的索引传递出去，后续会用到
                    resolve(index)
                }, delay)
            })
        })
        let p = Promise.race(pool)
        for(let i = this.limit; i < this.tasks.length; i++) {
            // 通过for循环形成一条promise链
            p = p.then((index) => {
                // 利用Promise.race拿到任务池中最快完成的任务，在then回调用通过之前存的这个任务在任务池中的索引，用新的任务将它替换
                pool[index] = new Promise((resolve) => {
                    const { delay, name } = this.tasks[i]
                    setTimeout(() => {
                        console.log(name)
                        resolve(index)
                    }, delay)
                })
                // 再利用Promise.race拿到任务池中最快完成的任务
                return Promise.race(pool)
            })
        }
        return p
    }
    add(delay, name)  {
        this.tasks.push({ delay, name })
    }
}
// const scheduler = new Scheduler(2)
// const addTask = scheduler.addTask
// class Scheduler {
//     constructor(limit) {
//         this.tasks = [] // 任务队列
//         this.limit = limit // 最大并发数
//         this.runningCount = 0 // 当前正在运行的任务个数
//     }
//     start() {
//         for(let i = 0; i < this.limit; i++) {
//             this.run()
//         }
//     }
//     add(delay, name) {
//         const promiseCreator = () => {
//             return new Promise((resolve, reject) => {
//                 setTimeout(() => {
//                     console.log(name, Date.now() - time)
//                     resolve()
//                 }, delay)
//             })
//         }
//         this.tasks.push(promiseCreator)
//     }
//     run() {
//         // tasks空校验 + 限制并发数
//         if (!this.tasks.length || this.runningCount >= this.limit) {
//             return
//         }
//         // 当前正在执行的任务数+1
//         this.runningCount++
//         // 从 tasks 头部取出一个任务并执行
//         this.tasks.shift()().finally(() => {
//             // 当前任务已经执行完了，所以 runningCount 需要-1
//             this.runningCount--
//             // 执行下一个任务
//             this.run()
//         })
//     }
// }
const scheduler = new Scheduler(2);
const addTask = (time, name) => {
  scheduler.add(time, name);
};

addTask(10000,"1");
addTask(5000,"2");
addTask(3000,"3");
addTask(4000,"4");
scheduler.start()
// scheduler.start()
// 的输出顺序是：2 3 1 4
// 2种思路 Promise.race(pool).then(p => Promise.race(pool))