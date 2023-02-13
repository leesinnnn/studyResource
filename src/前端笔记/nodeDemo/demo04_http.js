const http = require('http');
const server = http.createServer();

server.listen(3000, () => {
  console.log('服务器已经启动等待连接');
});

server.on('request', (request, response) => {
  switch (request.url) {
    case '/login':
      response.end('login');
      break;
    case '/index':
      response.end('index');
      break;
    default:
      response.end('');
  }
});
