const http = require('http')
const fs = require('fs')
const URL = require('url')
const template = require('art-template')

const comments = [
  {
    name: '李庆',
    content: '好呀',
    date: '2017-2-2'
  },
  {
    name: '李庆',
    content: '好呀',
    date: '2017-2-2'
  },
  {
    name: '李庆',
    content: '好呀',
    date: '2017-2-2'
  },
  {
    name: '李庆',
    content: '好呀',
    date: '2017-2-2'
  }
]

http
.createServer((request, response) => {
  const urlObj = URL.parse(request.url, true)
  const url = urlObj.pathname
  if (url === '/') {
    fs.readFile('./views/index.html', (err, data) => {
      if (err) {
        response.end('404 not found')
      } else {
        const html = template.render(data.toString(), {
          comments: comments
        })
        response.end(html)
      }
    })
  } else if (url.indexOf('/public/') === 0) {
    fs.readFile('.' + url, (err, data) => {
      if (err) {
        response.end('404 not found')
      } else {
        response.end(data)
      }
    })
  } else if (url === '/post') {
    fs.readFile('./views/post.html', (err, data) => {
      if (err) {
        response.end('404 not found')
      } else {
        response.end(data)
      }
    })
  } else if (url === '/pinglun') {
    urlObj.query.date = '2017-10-10'
    comments.unshift(urlObj.query)
    response.statusCode = 302
    response.setHeader('location', '/')
    response.end()
  } else {
    fs.readFile('./views/404.html', (err, data) => {
      if (err) {
        response.end('404 not found')
      } else {
        response.end(data)
      }
    })
  }
})
.listen(3000, _ => {console.log('running')})