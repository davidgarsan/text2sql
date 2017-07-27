const utils = require('./common');
const fs = require('fs');
const path = require('path');
const chai = require('chai');
let text2sql;

chai.expect();

const expect = chai.expect;
let textsList;

/** @test {Test2SQL#JSON} */
describe('Invocado Test2SQL con parámetros cargando un documento JSON', () => {
  before((done) => {
    utils.clearModule();
    process.argv.splice(2, 0, utils.jsonfile);
    process.argv.splice(3, 0, 'TEST');
    process.argv.push('-f');
    process.argv.push(utils.sqlfile);
    process.argv.push('-q');
    text2sql = require(utils.moduleName);
    text2sql.texts.then((list) => {
      textsList = list;
      done();
    });
  });

  after(utils.deleteSQLFile);

  /** @test {Test2SQL} */
  describe('Se crea un script SQL', () => {
    it('debería haberse creado un script SQL', () => {
      const existsSQL = fs.existsSync(utils.sqlfile);
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