const fs = require('fs');
const chai = require('chai');
let text2sql;
const htmlfile = './test/test.html';
const sqlfile = './test/test.sql';

chai.expect();

const expect = chai.expect;
let textsList;

const deleteSQLFile = function () {
  const tempFile = fs.openSync(sqlfile, 'r');
  fs.closeSync(tempFile);
  fs.unlinkSync(sqlfile);
};

/** @test {Test2SQL} */
describe('Invocado Test2SQL con parámetros ', () => {
  before((done) => {
    process.argv.splice(2, 0, htmlfile);
    process.argv.splice(3, 0, 'TEST');
    process.argv.push('-f');
    process.argv.push(sqlfile);
    process.argv.push('-q');
    text2sql = require('../src/index');
    text2sql.texts.then((list) => {
      textsList = list;
      done();});
  });

  after(() => deleteSQLFile());

  /** @test {Test2SQL} */
  describe('Se crea un script SQL', () => {
    it('debería haberse creado un script SQL', () => {
      const existsSQL = fs.existsSync(sqlfile);
      expect(existsSQL).to.be.ok;
    });
  });

  /** @test {Test2SQL} */
  describe('devuelve una lista de objetos', () => {
    it('debería devolver una lista de objetos', () => {
      expect(textsList).to.be.an('array');
      expect(textsList).to.not.be.empty;
    });
  });

  /** @test {Test2SQL} */
  describe('devuelve una lista de objetos key/value por cada texto', () => {
    it('debería devolver una lista de objetos con el formato key/value', () => {
      expect(textsList).to.satisfy(function(list) {
        return list.every(function(item) {
          return expect(item).to.be.an('object')
            && expect(item).to.have.property('key')
            && expect(item).to.have.property('value');
        });
      });
    });
  });

  /** @test {Test2SQL} */
  describe('devuelve una lista de objetos únicos', () => {
    it('debería devolver una lista de objetos', () => {
      let repetido = false;
      let keys = {};
      textsList.forEach(
        (item) => {
          !!keys[item.key] && (repetido = true);
          keys[item.key] = item;
        }
      );
      expect(repetido).to.be.false;
    });
  });
});
