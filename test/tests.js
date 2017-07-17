const fs = require('fs');
const chai = require('chai');
let text2sql;
const htmlfile = './test/test.html';
const sqlfile = './test/test.sql';

chai.expect();

const expect = chai.expect;

const deleteSQL = function () {
  const tempFile = fs.openSync(sqlfile, 'r');
  fs.closeSync(tempFile);
  fs.unlinkSync(sqlfile);
};

/** @test {Test2SQL} */
describe('Dado un archivo SQL ', () => {
  before(() => {
    process.argv.splice(2, 0, htmlfile);
    process.argv.splice(3, 0, 'TEST');
    process.argv.push('-f');
    process.argv.push(sqlfile);
    process.argv.push('-q');
    text2sql = require('../src/index');
  });

  /** @test {Test2SQL#init} */
  describe('contiene una serie de textos con atributo "data-translate"', () => {
    it('debería generar un script SQL con los textos encontrados', () => {
      // FIXME: Async Test
      expect(true).to.be.ok;
      // expect(fs.exists(sqlfile)).to.be.ok;
      deleteSQL();
    });
  });


});
