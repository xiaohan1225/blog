// 题目描述:手写 Promise 以及 Promise.all Promise.race 的实现
Promise.all = function (promises) {
  let index = 0
  const len = promises.length
  const results = []
  return new Promise((resolve, reject) => {
    for(let i = 0; i < len; i++) {
      promises[i].then((res) => {
        results[i] = res
        if (++index === len) {
          resolve(results)
        }
      }).catch((e) => {
        reject(e)
      })
    }
  })
}

Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for(let i = 0; i < promises.length; i++) {
      promises[i].then((res) => {
        resolve(res)
      })
      .catch((e) => {
        reject(e)
      })
    }
  })
}

const p1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(1)
  }, 2000)
})
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(2)
  }, 1000)
})

// Promise.all([p1,p2]).then((res) => {
//   console.log(res)
// }).catch((e) => {
//   console.log(e)
// })
// Promise.race([p1,p2]).then((res) => {
//   console.log('res', res)
// }).catch((e) => {
//   console.log('e', e)
// })