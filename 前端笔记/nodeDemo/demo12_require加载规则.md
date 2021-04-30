require加载是缓存加载的，意思就是加载一个module执行里面的代码之后就会把这个module放到缓存中，下一次再加载这个module的时候就会直接拿到该模块module.exports的值，不会再重新执行一遍里面的代码 。

node会先判断require里面的参数是什么形式的，如果是'./'或者'../'这种，它就会直接根据这个路径去找到这个文件进行加载，返回该文件的module.exports。

如果require里面的参数不是路径形式的，例如'fs','art-template'这种，node会先在自己的环境中找，如果找到了就加载，如果找不到，node会在调用require文件所在的当前目录找node_modules文件夹，再找art-template文件夹，再找里面的package.json里面的main所对应的属性值，根据属性值加载对应文件。如果 package.json 文件不存在或者 main 指定的入口模块是没有的，则 node 会自动找该目录下的 index.js，也就是说 index.js 会作为一个默认备选项。如果在调用require所在的文件目录没有找到node_modules，就用往上一层找有没有node_modules文件夹，没找到继续往上知道磁盘的根目录都没找到就报错。