# babel
> babel是一个转译器，是高级语言之间的转化。编译器则是高级语言到低级语言的转化
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
1. `template.ast(code)()`返回整个AST
2. `template(code)(options)`支持模板占位符.
```typescript
const fn = template('console.log(NAME)')
fn({
  NAME: t.stringLiteral('test')
})
```

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
