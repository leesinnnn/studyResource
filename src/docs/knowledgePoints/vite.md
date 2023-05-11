# vite
## 踩坑
### caught SyntaxError: Cannot use import statement outside a module
**原因:** index.html引入index文件的script标签需要加上type属性，值为module。浏览器的script标签需要加上该属性才能支持esmodule
```html
<script src="./src/index.ts" type="module"></script>
```
### 找不到模块“./index.module.scss”或其相应的类型声明
**原因:** 在global.d.ts文件中声明`declare module "*.scss"`
### Cannot find module 'node:path'
**原因**: node版本过低导致