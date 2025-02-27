/**
 * 实现一个LazyMan，可以按照以下方式调用:
LazyMan(“Hank”)输出:
Hi! This is Hank!

LazyMan(“Hank”).sleep(10).eat(“dinner”)输出
Hi! This is Hank!
//等待10秒..
Wake up after 10
Eat dinner~

LazyMan(“Hank”).eat(“dinner”).eat(“supper”)输出
Hi This is Hank!
Eat dinner~
Eat supper~

LazyMan(“Hank”).eat(“supper”).sleepFirst(5)输出
//等待5秒
Wake up after 5
Hi This is Hank!
Eat supper
 */
class Schedule {
    constructor(name) {
        this.name = name
        this.tasks = [() => {
            console.log(`Hi! This is ${name}!`)
        }]
        setTimeout(() => {
            this.run()
        }, 0)
    }
    async run() {
        while(this.tasks.length) {
            const task = this.tasks.shift()
            await task()
        }
    }
    sleepFirst(delay) {
        this.tasks.unshift(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(`Wake up after ${delay}`)
                    resolve()
                }, delay * 1000)
            })
        })
    }
    sleep(delay) {
        this.tasks.push(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(`Wake up after ${delay}`)
                    resolve()
                }, delay * 1000)
            })
        })
        return this
    }
    eat() {
        this.tasks.push(() => {
            console.log('Eat dinner~')
        })
        return this
    }
}

const LazyMan = function (name) {
    return new Schedule(name)
}
// LazyMan('Hank')
// LazyMan('Hank').sleep(10).eat('dinner')
// LazyMan('Hank').eat('dinner').eat('supper')
LazyMan('Hank').eat('supper').sleepFirst(5)