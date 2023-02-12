// node里面没有全局作用域，只有模块作用域
// 不同模块之间的变量是不可以相互访问的
// 意思就是a模块引入了b模块，就算他们有相同的变量名也不会覆盖
// 如果要实现模块之间的通信，就要采用exports对象

const result = require('./b.js'); // require返回的是exports对象

console.log(result);
console.log(result.name);
