const fs = require('fs');
const htmlfile = './test/mock/test.html';
const jsonfile = './test/mock/strings.json';
const sqlfile = './test/test.sql';

module.exports = {
  htmlfile,
  jsonfile,
  sqlfile,
  clearModule: () => {
    delete require.cache[require.resolve('../src/index')];
  },
  deleteSQLFile: () => {
    const tempFile = fs.openSync(sqlfile, 'r');
    fs.closeSync(tempFile);
    fs.unlinkSync(sqlfile);
  }
};
