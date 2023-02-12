const http = require('http')

const server = http.createServer()

server.on('request', (request, response) => {
  const url = request.url
  if (url === '/plain') {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8')
    response.end('你好呀')
  } else if (url === '/html') {
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.end('<h1>你也好呀</h1>')
  }
})

server.listen(3000, () => {
  console.log('server is running')
})
