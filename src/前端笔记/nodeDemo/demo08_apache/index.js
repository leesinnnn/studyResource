const http = require('http')
const fs = require('fs')

const server = http.createServer()

server.on('request', (request, response) => {
  const url = request.url
  fs.readFile('./demo08_apache/www/' + url, (err, data) => {
    if (err) {
      response.end('404 not found')
    } else {
      // const suffix = url.split('.').reverse()[0]
      response.end(data)
    }
  })
})

server.listen(3000, _ => {
  console.log('running')
})