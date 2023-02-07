# 学习资源整理
> 之前学习过于没有章法，貌似看了很多学了很多，但是时间一久就不再记得了。这篇文档对学习资源分类整理、对获取学习资源的途径也做整理以及一些学习计划的安排，顺便再放些积累的零散知识点，期望能够更有条理的学习。

# 学习途径
1. 微信公众号
2. 掘金
3. github star的一些博客仓库
4. RSS 聚合应用 - 今日热榜

# 学习资源
## 掘金小册
1. [Babel通关秘籍](https://juejin.cn/book/6946117847848321055?enter_from=course_center)
2. [Webpacck5核心原理与应用实践](https://juejin.cn/book/7115598540721618944?enter_from=course_center)
3. [用 npm script 打造超溜的前端工作流](https://juejin.cn/book/6844723718749421582?enter_from=course_center)
4. [玩转 CSS 的艺术之美](https://juejin.cn/book/6850413616484040711?enter_from=course_center)
5. [JavaScript 设计模式核⼼原理与应⽤实践](https://juejin.cn/book/6844733790204461070?enter_from=course_center)
6. [前端调试通关秘籍](https://juejin.cn/book/7070324244772716556?enter_from=course_center)

## 微信公众号
1. 歌白说深度文章

# 知识点
## commit message规范
规范格式为 type(scope): subject

1. 所有type
```
feat: 新功能
fix: bug修复
docs: 文档改变
style: 代码格式改变
refactor: 代码重构
perf: 性能优化
test: 增加测试
build: 改变了build工具
revert: 撤销上一次的commit
chore: 改变构建流程、或者增加依赖库、工具
```
2. scope 此次变更影响的范围(可选)

3. subject 为此次变更的描述 50个字符以内

## npm script
1. 命令串行
```
npm run test && npm run dev
```
2. 命令并行
> 加上wait的好处是启动了长时间进程可以用ctrl + c来停止，否则没办法结束启动在后台的进程。
```
npm run test & npm run dev & wait
```
3. npm-run-all
> npm-run-all 可以更简洁地运行多命令，并且支持通配符匹配
```
npm-run-all lint:* build
npm-run-all --parallel lint:* build
```
4. 给npm script传递参数
> 注意 --fix 参数前面的 -- 分隔符，意指要给 npm run lint:js 实际指向的命令传递额外的参数。
```
{
  "scripts": {
    "lint:js": "eslint *.js",
    "lint:js:fix": "npm run lint:js -- --fix"
  }
}
```
5. 使用npm script钩子
> 执行npm run cover时会先执行precover命令，执行完cover命令后会执行postcover命令
```
{
  "scripts": {
    "precover": "rm -rf coverage",
    "cover": "nyc --reporter=html npm test",
    "postcover": "rm -rf .nyc_output && opn coverage/index.html"
  }
}
```
6. npm script使用变量
> npm run env 能拿到完整的变量列表，使用$符号获取变量
```
{
  "scripts": {
    "test": "echo $npm_package_name"
  }
}
```
7. 使用node.js代替shell脚本
```
// cover.js
const { rm, cp, mkdir, exec, echo, env } = require('shelljs');
const chalk = require('chalk');
const npm_package_version = env['npm_package_version'];

console.log(chalk.green('1. remove old coverage reports...'));
rm('-rf', 'coverage');
rm('-rf', '.nyc_output');

console.log(chalk.green('2. run test and collect new coverage...'));
exec('nyc --reporter=html npm run test');

console.log(chalk.green('3. archive coverage report by version...'));
mkdir('-p', 'coverage_archive/' + npm_package_version);
cp('-r', 'coverage/*', 'coverage_archive/' + npm_package_version);

console.log(chalk.green('4. open coverage report for preview...'));
exec('npm-run-all --parallel cover:serve cover:open');
```
```
   "scripts": {
      "cover": "node scripts/cover.js",
   },
```
# 学习计划
## 近期计划
1. monorepo入门
2. pnpm入门
3. webpack入门
4. vite入门
5. 前端调试入门

## 每日计划
### 淬体
#### 减脂
> 每次四组
* 跳绳100个
* 开合跳30次
* 跳绳100个
* 同侧提膝30次
* 跳绳100个
* 胯下击掌20次
* 跳绳100个
* 深蹲跳20次
#### 增肌
> 做三组，第一组12次，第二组14次，第三组10次
* 哑铃飞鸟
* 哑铃胳膊弯举
* 哑铃上推
* 哑铃胸前保持

### 冥想
1. 冥想歌曲：看远方的站台 -陈粒
2. 冥想和思考时有意识地集中在额头

## 学习概要
> 学习了什么
1. 手写一个redux。洋葱模型，一层套一层，装饰器模式。仓库名：redux-raw
2. pnpm的worksspace构建monorepo项目
3. 用npm script打造工作流