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