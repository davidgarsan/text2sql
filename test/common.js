const fs = require('fs');
const htmlfile = './test/mock/test.html';
const jsonfile = './test/mock/strings.json';
const sqlfile = './test/test.sql';
const moduleName = '../src/index';

module.exports = {
  htmlfile,
  jsonfile,
  sqlfile,
  moduleName,
  clearModule: () => {
    delete require.cache[require.resolve(moduleName)];
  },
  deleteSQLFile: () => {
    const tempFile = fs.openSync(sqlfile, 'r');
    fs.closeSync(tempFile);
    fs.unlinkSync(sqlfile);
  }
};
