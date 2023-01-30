const { exec } = require('shelljs');
const hooksType = process.argv[2];
const script = process.argv[3];

exec(`husky add .husky/${hooksType} "${script}"`);
