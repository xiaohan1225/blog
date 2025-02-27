// 利用 XMLHttpRequest 手写 AJAX 实现

function ajax(options) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(options.method, options.url, options.sync)
    xhr.onreadyStateChange = function () {
      if (xhr.readyState !== 4) return      
      if (xhr.status === 200 && xhr.readyState === 4) {
        resolve(xhr.responseText)
      } else {
        reject(new Error(xhr.responseText))
      }
    }
    xhr.send()
  })
}