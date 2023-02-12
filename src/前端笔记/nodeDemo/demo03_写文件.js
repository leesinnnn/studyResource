const fs = require('fs')

fs.writeFile('./data/1.txt', '这是后面追加的文字', err => console.log('写入成功'))
