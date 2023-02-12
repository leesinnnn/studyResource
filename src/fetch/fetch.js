// fetch返回的是一个promise对象，它的value值是一个response对象
// fetch对400和500类型的错误不会报错，需要自己根据response.status来判度一下
// fetch不能自动携带cookie，需要手动指定
// fetch没有中断请求，需要结合abortController和Promise.race来中断网络请求

fetch('http://localhost:3000/posts/2')
  .then(response => {
    console.log(response)
    return response.json()
  })
  .then(data => {
    console.dir(data)
  })
