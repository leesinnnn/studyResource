const fs = require('fs')
fs.readFile('./data/1.txt', (err, data) => {
  console.log(data.toString())
})