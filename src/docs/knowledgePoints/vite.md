# vite
## 踩坑
**caught SyntaxError: Cannot use import statement outside a module**
**原因:** index.html引入index文件的script标签需要加上type属性，值为module。浏览器的script标签需要加上该属性才能支持esmodule
```html
<script src="./src/index.ts" type="module"></script>
```

**找不到模块“./index.module.scss”或其相应的类型声明**
**原因:** 在global.d.ts文件中声明`declare module "*.scss"`

**Cannot find module 'node:path'**
**原因**: node版本过低导致

**is outside of Vite serving allow list**
**原因:** 重启vscode

## 知识点
### 对不同内容的处理
#### 对css的处理
**css module**
``.module.(css|scss|less)``结尾的样式文件，vite能自动将其处理成css module模块
```javascript
import styles from 'index.module.scss'
```

**postcss**
使用``postcss-preset-env``插件处理前缀补全和css语法降级等功能
```javascript
export default defineConfig({
  css: {
    postcss: {
      plugins: [postcssPresetEnv()]
    }
  }
})
```

**css预处理器**
直接安装对应的css预处理器的npm包即可处理
``pnpm i sass`` ``pnpm i less``

#### 对图片，svg资源的处理
1. 通过import直接导入得到的是资源的绝对路径
2. 导入路径后缀增加``?raw``,得到的是资源的内容
```javascript
import img '@/assets/test.png?raw'
import svg from '@/assets/test.svg?raw'
```

#### 对JSON文件的处理
直接导入JSON文件将JSON文件转化成js对象且可以通过解构的方式导入
```javascript
import { a } from '@/assets/test.json'
```

#### 对worker脚本的处理
导入脚本作为worker
```javascript
import Worker from './worker.js?worker'
import SharedWorker from './worker.js?sharedworker'
```

### 环境变量
环境变量可以通过特定的文件声明，在浏览器环境通过``import.meta.env``读取，在node环境通过``process.env``读取。不同的打包模式对应于不同的文件名。
```
.env文件：所有模式可加载
.env.development: dev模式
.env.production: production模式
```
为了避免变量被污染，vite并没有直接暴露在process.env中，可以通过vite提供的loadEnv函数来获取
```javascript
import { defineConfig, loadEnv } from 'vite';
export default defineConfig(({ mode }) => {
  /**
   * @param {string} mode 需要加载哪个模式的变量
   * @param {string} path 环境变量声明文件所在的路径
   * @param {string} name 需要加载哪个变量名 ''为所有变量
   */
  const env = loadEnv(mode, process.cwd(), '')
  // 配置对象
  return {
    // ....
  }
})
```