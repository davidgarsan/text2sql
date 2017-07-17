const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const log = console.log;
const lang = ['ca_ES', 'de_DE', 'en_UK', 'es_ES', 'eu_ES', 'fr_FR', 'gl_ES', 'it_IT', 'pt_PT', 'va_ES'];
const DEFAULT_COMMENT = 'Creado con Text2SQL';
const DEFAULT_FILENAME = 'text_inserts.sql';
const DEFAULT_ATTRIBUTE_NAME = 'data-translate';
const DEFAULT_SCHEME = 'BEL';
const DEFAULT_OPTIONS = '';

module.exports = {
  list: null,

  conf: null,

  getScheme: function () {
    return this.conf.scheme && this.conf.scheme;
  },

  getParams: function () {
    const filePath = process.argv[2];
    const appName = process.argv[3];
    let fileName, attrName, scheme, comment, options = '', quiet = false;

    if (filePath === undefined || !fs.existsSync(filePath)) {
      throw new Error('Se debe pasar como primer parámetro el path de un archivo HTML.');
    }
    else if (appName === undefined) {
      throw new Error('Se debe pasar como segundo parámetro el nombre de la aplicación.');
    }

    if (process.argv.indexOf('-f') != -1) {
      fileName = process.argv[process.argv.indexOf('-f') + 1];
    } else {
      fileName = DEFAULT_FILENAME;
    }

    if (process.argv.indexOf('-s') != -1) {
      scheme = process.argv[process.argv.indexOf('-s') + 1] || '';
    } else {
      scheme = DEFAULT_SCHEME;
    }

    if (process.argv.indexOf('-c') != -1) {
      comment = process.argv[process.argv.indexOf('-c') + 1] || '';
    } else {
      comment = DEFAULT_COMMENT;
    }

    if (process.argv.indexOf('-a') != -1) {
      attrName = process.argv[process.argv.indexOf('-a') + 1];
    } else {
      attrName = DEFAULT_ATTRIBUTE_NAME;
    }

    if (process.argv.indexOf('-o') != -1) {
      options = process.argv[process.argv.indexOf('-o') + 1];
    } else {
      options = DEFAULT_OPTIONS;
    }

    if (process.argv.indexOf('-q') != -1) {
      quiet = true;
    }

    this.conf = {
      filePath,
      appName,
      attrName,
      fileName,
      scheme,
      comment,
      options,
      quiet
    };

    return this.conf;
  },
  buildSQL: function (list) {
    this.list = list;
    const sqlIdioma = this.list.reduce((a, b, c, d) => a + lang.reduce(
      (x, y, z, k) => x + (x && '\n\n') +
      `-- ${b.key} (${k[z]})
INSERT INTO ${this.getScheme() + '.'}BDPTB079_IDIOMA (
  IDIOMA,
  CODIGO,
  TRADUCCION,
  COMENTARIO)
  VALUES (
    '${k[z]}',
    '${b.key}',
    '${b.value}',
    '${this.conf.comment}');`, '') + '\n\n'
      , '');

    const deletes = this.list.reduce(
      (a, b, c) => a + (a && ',\n') + `  '${b.key}'`, ''
    );

    const sqlApp = this.list.reduce((a, b, c, d) => a + (a && '\n\n') +
    `-- ${b.key} (${this.conf.appName})\nINSERT INTO BEL.BDPTB079_IDIOMA_APLICATIVO (
  CODIGO,
  APLICATIVO,
  OPCIONES)
  VALUES (
    '${b.key}',
    '${this.conf.appName}',
    '${this.conf.options}');`, '');

    const date = Date(new Date().toLocaleString());

    return `-- <${path.basename(this.conf.fileName)}>
-- Archivo autogenerado con Text2SQL (${date})

-- DELETE/INSERT BDPTB079_IDIOMA
DELETE FROM ${this.getScheme() + '.'}BDPTB079_IDIOMA WHERE CODIGO in (\n${deletes}\n);\n\n${sqlIdioma}
-- DELETE/INSERT BDPTB079_IDIOMA_APLICATIVO
DELETE FROM ${this.getScheme() + '.'}BDPTB079_IDIOMA_APLICATIVO WHERE CODIGO in (\n${deletes}\n);\n\n${sqlApp}
`;
  },

  mkDirIfNot: function (filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    this.mkDirIfNot(dirname);
    fs.mkdirSync(dirname);
  },

  writeToSQLFile: function (sql) {
    this.mkDirIfNot(this.conf.fileName);
    fs.writeFile(this.conf.fileName, sql, err => {
      if (err && err.code !== 'ENOENT') {
        throw err;
      }
      this.conf.quiet || this.report();
    })
  },

  report: function () {
    log(chalk`{bold Script SQL generado correctamente en ${this.conf.fileName}}`);

    log(chalk`
- Aplicación: {hex('#66cc10') ${this.conf.appName}} 
- Ruta HTML: {hex('#66cc10') ${path.resolve(this.conf.filePath)}}
- Ruta SQL: {hex('#66cc10') ${path.resolve(this.conf.fileName)}}
- Atributo buscado: {hex('#66cc10') ${this.conf.attrName}}  
- Esquema de BBDD: {hex('#66cc10') ${this.conf.scheme}}
- Textos encontrados {bold (${this.list.length})}:
${this.list.map((o) => chalk`    {hex('#66cc10') ${o.key}:} {white ${o.value}}`).join('\n')}

`);
  }
};