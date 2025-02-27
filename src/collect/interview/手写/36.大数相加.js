// 实现一个add方法完成两个大数相加

let a = "9007199254740991";
let b = "1234567899999999999";

function add(a, b) {
  let carry = 0
  const len = Math.max(a.length, b.length)
  a = a.padStart(len, '0')
  b = b.padStart(len, '0')
  let res = ''
  for(let i = len - 1; i >= 0; i--) {
    let sum = Number(a[i]) + Number(b[i]) + carry
    carry = Math.floor(sum / 10)
    sum %= 10
    res = sum + res
  } 
  if (carry !== 0) {
    res = carry + res
  }
  return res
}
console.log(add(a, b))