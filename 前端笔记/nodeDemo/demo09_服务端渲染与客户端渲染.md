客户端渲染是指在浏览器异步发送请求，从服务器拿到异步数据之后再进行显示
服务端渲染是指在服务器端就把所有的数据渲染完成再发送给浏览器，浏览器拿到之后直接解析
客户端渲染不利于seo的优化
服务器端的渲染是可以被爬虫抓取到的，客户端异步渲染是很难被爬虫抓取到的
所以你会发现真正的网站既不是纯异步也不是纯服务端渲染出来的而是两者结合来做的
例如京东的商品列表就采用的是服务端渲染，目的是为了seo搜索引擎优化，而它的商品评论列表为了用户体验，而且也不需要seo优化，所以采用是客户端渲染