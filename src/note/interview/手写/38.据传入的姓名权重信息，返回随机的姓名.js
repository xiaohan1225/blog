// 根据传入的姓名权重信息，返回随机的姓名（随机概率依据权重）
/**
 * @description: 根据传入的姓名权重信息，返回随机的姓名（随机概率依据权重）
 * @param {Array} personValue
 * @returns {String} personName 姓名
 */
 var getPersonName = function (personValue) {
     const sum = personValue.reduce((prev, cur) => {
        cur.startW = prev
        cur.endW = prev + cur.weight
        return cur.endW
     }, 0)
     const random = Math.random() * sum
     return personValue.find(p => random >= p.startW && random <= p.endW).name
 };
 const person = [
   {
     name: "张三",
     weight: 1,
   },
   {
     name: "李四",
     weight: 10,
   },
   {
     name: "王五",
     weight: 100,
   },
 ];
 function getResult(count) {
   const res = {};
   for (let i = 0; i < count; i++) {
     const name = getPersonName(person);
     res[name] = res[name] ? res[name] + 1 : 1;
   }
 
   console.log(res);
 }
 getResult(10000);

//  var getPersonName = function (personValue) {
//     // 标记区间，并且获得weight的总数
//     let sum = personValue.reduce((pre, cur) => {
//       cur.startW = pre;
//       return (cur.endW = cur.weight + pre);
//     }, 0);
//     let s = Math.random() * sum; // 获得一个 0 - 111 的随机数
//     // 判断随机数的所属区间
//     let person = personValue.find((item) => item.startW < s && s <= item.endW);
//     return person.name;
//   };