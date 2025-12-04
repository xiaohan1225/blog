/**
 * let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';
    let data = {
      name: '姓名',
      age: 18
    }
    render(template, data); // 我是姓名，年龄18，性别undefined
 */
function render(template, data) {
  const reg = /\{\{(.+?)\}\}/g
  return template.replace(reg, ($, $1) => {
    return data[$1]
  })  
}
let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';
let data = {
  name: '姓名',
  age: 18
}
console.log(render(template, data))