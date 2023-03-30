# babel
> 1. babel是一个转译器，是高级语言之间的转化。编译器则是高级语言到低级语言的转化
> 2. babel的parser基于acorn来实现，acorn提供了插件机制便于作用于词法分析和语法分析阶段，所以babel的parser可以通过实现acorn插件来转译一直在迭代更新的新语法新特性

## babel转译流程
babel的转译流程分为三个阶段。第一个阶段是将代码通过词法分析和语法分析转换成AST树；第二个阶段是遍历AST进行AST的增删改查工作；转译的过程主要发生在此阶段。第三个阶段是将AST树转化生成目标代码，生成sorceMap等。

三个阶段分别对应于babel的三个包：@babel/parser、@babel/traverse、@bebel/generator

## babel的AST
> [AST可视化工具](https://astexplorer.net/)
### Literal
> 字面量，有多种字面量
1. StringLiteral 字符串字面量
2. TemplateLiteral 模板字面量
3. NumericLiteral 数字字面量
4. RegExpLiteral 正则字面量
5. BigintLiteral 大数字面量
6. NullLiteral null字面量
7. ......

### Idedntifier
> 标识符
变量名、属性名、参数名等各种声明和引用的名字

### Statement
> 语句，独立执行的最小单位。有多种语句
1. BreakStatement
2. ForStatement
3. ForInStatement
4. WhileStatement
5. ExpressionStateMent

### Declaration
> 声明语句，是一种特殊的语句
1. VariableDeclaration
2. FunctionDeclaration
3. ClassDeclaration
4. ImportDeclaration
5. ExportDefaultDeclaration

### Expression
> 表达式，特点是执行完成后与返回值，这是和statement的区别。
1. ArrayExpression [1,2,3]
2. AssignMentExpression a = 1
3. BinaryExpression 二元表达式 a + b
4. conditionalExpression a ? b : c

## babel的api
### @babel/parser
parser接收两个参数，需要parse的字符串和parse的配置。
```typescript
interface IParseOptions {
  plugins: string[]; //指定jsx，typescript等插件来解析对应的语法
  sourceType: 'modudle' | 'script' | 'unambiguus'; //指定是否解析模块化语法
  // ......
}
function parser(input: string, options: IParseOptions) {

}
```

### @babel/traverse
traverse接收两个参数，需要traverse的AST结构和traverse配置
```typescript
function traverse(ast: AST, options: ITraverseOptions) {

}
```
下面贴一些traverse配置的例子
1. 指定开始遍历和结束遍历两个阶段
```typescript
{
  FunctionDeclaration: {
    enter(path, state) {}, // 进入节点时调用
    exit(path, state) {}  // 离开节点时调用
  }
}
```
2. 只指定一个函数则是进入节点时调用
```typescript
{
  FunctionDeclaration(path, state) {}
}
```
3. 一个visitor指定多个AST类型
```typescript
{
  'FunctionDeclaration|VariableDeclaration'(path, state) {}
}
```
4. 使用别名指定一个大类的AST
```typescript
{
  Declaration(path, state) {}
}
```

### @babel/types
创建或者判断一些AST的类型
#### 创建
```typescript
t.ifStatement(test, consequent, alternate)
```
#### 判断
1. is返回布尔值，assert断言为否时抛出错误
2. options配置附加一个更加精细的判断如`t.isIdentifier(node, { name: 'test' })`
```typescript
t.isIfStatement(node, options)
t.assertIfStatement(node, options)
```

### @babel/template
使用@babel/types创建AST较为复杂需要一个一个创建和组装，@babel/template提供更为方便地创建AST的模板
1. `template.ast(code)`返回整个AST
2. `template(code)(options)`支持模板占位符.
```typescript
const fn = template('console.log(NAME)')
fn({
  NAME: t.stringLiteral('test')
})
```
3. `template.expression(code)(options)`只返回表达式AST节点

### @babel/generator
根据AST生成字符串代码和sourceMap
```typescript
interface IGeneratorOption {
  sourceMap: boolean; // 是否生成sourceMap
}
function generator(ast: AST, options: IGeneratorOption): { code: string; map: string } {}
```

### @babel/code-frame
在控制台打印一些报错信息，包含高亮和行数定位等功能

### @babel/core
babel基于以上的这些包封装实现了编译、插件和预设等功能。@babel/core提供了多种api。
```typescript
// options主要配置插件和预设
// 处理源代码
function transformSync(code: string, options: ITransformOption): { code: string; map: string; ast: AST }

// 处理源文件
function transformFileSync(file: string, options: ITransformOption): { code: string; map: string; ast: AST }

// 异步版本
function transformAsync(code: string, options: ITransformOption): Promise<{ code: string; map: string; ast: AST }>
function transformFileAsync(file: string, options: ITransformOption): Promise<{ code: string; map: string; ast: AST }>
```
## generate和sourceMap原理
### generate
generate函数根据AST生成代码字符串。generate函数内部实现对各种类型的AST转换的工具，将AST上省略的结构再补充回来。
如ConditionExpression就是将AST的test，consequent，alternate用`?`和`：`拼接起来
```typescript
function ConditionExpression() {
  this.print(node.test)
  this.space()
  this.token('?')
  this.space()
  this.print(node.consequent)
  this.space()
  this.token(':')
  this.print(node.alternate)
}
```
### sourceMap
1. sourceMap是源代码和转换之后的代码的一个映射关系。
2. sourceMap生成原理是在parse成的AST中的node.loc中保留了原始的行号和列号，AST在traverse过程中虽然在树的位置发生了变化但是node.loc没有变化，在generate过程中计算现在AST的行列号与原来的做一个对应生成sourceMap。
3. sourceMap的生成和解析有对应的api
```typescript
// 生成sourceMap
const map = new SourceMapGenerator({ file: "sourceMap.js" })
map.addMapping({
  generated: {
    line: 10,
    column: 35
  },
  source: "foo.js",
  original: {
    line: 33,
    column: 2
  },
  name: "console.log"
})
// 解析sourceMap
SourceMapConsumer.with(rawSourceMap, null, consumer => {
  // 目标代码位置查询源码位置
  consumer.originalPositionFor({
    line:2,
    column: 28
  })
  // 源码位置查询模板代码位置
  consumer.generatedPositionFor({
    line: 2,
    column: 10
  })
})
```
4. sourceMap内联到产物文件中或者通过url指定，谷歌火狐等浏览器能自动解析sourceMap显示源码的位置。
但是一般生产环境下会将sourceMap上传至错误收集平台，同时收集产物报错信息，在错误收集平台进行源码位置的解析。
```typescript
//# sourceMappingURL=http://example.com/path/to/your/sourcemap.map
```

## babel的插件和预设
1. 插件和预设既可以是一个字符串也可以是一个对象或者函数，如果需要指定配置可以用二元数组，第二个元素为配置项。
2. 二者执行顺序为先执行插件再执行预设，插件从前往后执行，预设从后往前执行
```typescript
transform(code, {
  plugins: [babelPlugin],
  presets: [babelPreset, ['@babel/preset-env', { option: 1 }]]
})
```
### 插件
插件有两种方式声明，一种是函数形式，另外一种是对象形式
```typescript
// api包含types和tempalte等api，option是传入的配置
function babelPlugin(api, option) {
  return {
    // 修改传入的配置项
    manipulateOptions(opt, parserOpt) {},
    pre(file) {},
    visitor: {
      CallExpression(path, state) {}
    },
    post(file) {}
  }
}

const babelPlugin = {
  // 修改传入的配置项
  manipulateOptions(opt, parserOpt) {},
  // 调用插件之前的逻辑
  pre(file) {},
  visitor: {
    CallExpression(path, state) {}
  },
  // 调用插件之后的逻辑
  post(file) {}
}
```

### 预设
预设则是插件的集合，组合多个插件。预设也有函数和对象两种形式。
```typescript
function babelPreset(api, option) {
  return {
    plugins: [],
    presets: []
  }
}

const babelPreset = {
  plugins: [],
  presets: []
}
```