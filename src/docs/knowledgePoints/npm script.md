# npm script
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