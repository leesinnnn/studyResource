const fs = require('fs');
// eslint-disable-next-line n/handle-callback-err
fs.readFile('./data/1.txt', (err, data) => {
  console.log(data.toString());
});
