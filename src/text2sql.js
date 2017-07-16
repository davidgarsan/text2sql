// node index.js PATH [-f FILE] [-s SCHEME] [-c COMMENT] [-p PARAM_NAME]

const jsdom = require('jsdom');
const fs = require('fs');
const {JSDOM} = jsdom;
const lang = ['ca_ES', 'de_DE', 'en_UK', 'es_ES', 'eu_ES', 'fr_FR', 'gl_ES', 'it_IT', 'pt_PT', 'va_ES'];
let scheme = 'BEL';
let paramName = 'data-translate';
let comment = 'Creado con Text2SQL';
let fileName = 'text_inserts.sql';
const filePath = process.argv[2];

if(process.argv.length == 3 && process.argv.indexOf('-h') != -1){
  return console.log(`
Text2SQL

Esta utilidad inspecciona documentos HTML, extrayendo los textos a traducir y 
generando un script SQL para su inserción en SQL.
  
Uso:
  text2sql -h                         Imprime este mensaje
  text2sql -f <fileName>              Nombre del archivo a generar con el script de sql, por defecto 'text_inserts.sql'
  text2sql -s <schema>                Nombre del esquema de BBDD a emplear, por defecto 'BEL'
  text2sql -c <comment>               Comentario a introducir en cada insert de la tabla, por defecto 'Creado con Text2SQL'
  text2sql -p <paramName>             Nombre del parámetro de traducciones a localizar en el documento HTML, por defecto 'data-translate'  
`);
}

if(filePath === undefined) {
  throw new Error('Debe pasarse como parámetro el path de un archivo HTML');
}

if(process.argv.indexOf('-f') != -1) {
  fileName = process.argv[process.argv.indexOf('-f') + 1];
}

if(process.argv.indexOf('-s') != -1) {
  scheme = process.argv[process.argv.indexOf('-s') + 1] || '';
}

if(process.argv.indexOf('-c') != -1) {
  comment = process.argv[process.argv.indexOf('-c') + 1] || '';
}

if(process.argv.indexOf('-p') != -1) {
  comment = process.argv[process.argv.indexOf('-p') + 1];
}

function buildSQL(list) {
  const sql = list.reduce((a, b, c, d) => a + lang.reduce(
    (x, y, z, k) => x + (x && '\n\n') +
`-- ${b.key} (${k[z]})
INSERT INTO ${scheme && scheme + '.'}BDPTB079_IDIOMA (
  IDIOMA,
  CODIGO,
  TRADUCCION,
  COMENTARIO)
  VALUES (
    '${k[z]}',
    '${b.key}',
    '${b.value}',
    '${comment}');`, '') + '\n\n'
    , '');

  const deletes = list.reduce(
    (a, b, c) => a + (a && ',\n') + `  '${b.key}'`, ''
  );

  return `DELETE FROM ${scheme}BDPTB079_IDIOMA WHERE CODIGO in (\n${deletes}\n);\n\n${sql}`;
}

function writeToSQLFile(sql) {
  fs.writeFile(fileName, sql, function (err) {
    if (err && err.code !== 'ENOENT') {
      throw err;
    }
    console.info('Archivo SQL escrito en ' + fileName);
  })
}

const html = JSDOM.fromFile(filePath, {}).then(dom => {
  let list = Array.prototype.slice.call(dom.window.document.querySelectorAll(`[${paramName}]`))
    .map(
      (o) => ({key: o.getAttribute(paramName), value: o.textContent.trim()})
    );
  const uniq = new Set();

  list.forEach(e => uniq.add(JSON.stringify(e)));

  list = Array.from(uniq).map(e => JSON.parse(e));

  const sql = buildSQL(list);

  writeToSQLFile(sql);

}).catch(console.error);

