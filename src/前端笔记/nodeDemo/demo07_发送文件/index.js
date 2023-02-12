// https://tool.oschina.net/commons content-type对照表
const http = require('http')
const fs = require('fs')

const server = http.createServer()

server.on('request', (request, response) => {
  const url = request.url
  if (url === '/') {
    fs.readFile('./demo07_发送文件/index.html', (err, data) => {
      if (err) {
        console.log('读取文件失败')
      } else {
        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        response.end(data)
      }
    })
  } else {
    if (url === '/image') {
      fs.readFile('./demo07_发送文件/a.jpg', (err, data) => {
        if (err) {
          response.end('服务器错误')
        } else {
          response.setHeader('Content-type', 'image/jpeg')
          response.end(data)
        }
      })
    }
  }
})

server.listen(3000, () => {
  console.log('server is running')
})
