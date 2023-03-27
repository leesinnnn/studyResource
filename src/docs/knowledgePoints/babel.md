# babel
> babel是一个转译器，是高级语言之间的转化。编译器则是高级语言到低级语言的转化
## babel转译流程
babel的转译流程分为三个阶段。第一个阶段是将代码通过词法分析和语法分析转换成AST树；第二个阶段是遍历AST进行AST的增删改查工作；转译的过程主要发生在此阶段。第三个阶段是将AST树转化生成目标代码，生成sorceMap等。

三个阶段分别对应于babel的三个包：@babel/parser、@babel/traverse、@bebel/generator