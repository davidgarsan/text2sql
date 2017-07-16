#!/usr/bin/env node

const jsdom = require('jsdom');
const fs = require('fs');
const path = require('path');
const {JSDOM} = jsdom;
const chalk = require('chalk');
const figlet = require('figlet');
const lang = ['ca_ES', 'de_DE', 'en_UK', 'es_ES', 'eu_ES', 'fr_FR', 'gl_ES', 'it_IT', 'pt_PT', 'va_ES'];
let scheme = 'BEL';
let paramName = 'data-translate';
let comment = 'Creado con Text2SQL';
let fileName = 'text_inserts.sql';
const filePath = process.argv[2];

if (process.argv.length == 3 && process.argv.indexOf('-h') != -1) {

  console.log(
    chalk.hex('#66cc10')(
      figlet.textSync('Text2SQL', {horizontalLayout: 'full'})
    )
  );
  console.log(chalk.bold('\nText2SQL'));
  console.log(`
Esta utilidad inspecciona documentos HTML, extrayendo los textos a traducir
y genera a partir de estos datos un script SQL para su inserción en BBDD.

El SQL generado insertará en la tabla BDPTB079_IDIOMA, después de un borrado preventivo,
los siguientes idiomas como preparación a su traducción:
- Catalán (ca_ES).
- Alemán (de_DE).
- Inglés (en_UK).
- Castellano (es_ES).
- Euskera (eu_ES).
- Francés (fr_FR).
- Gallego (gl_ES).
- Italiano (it_IT).
- Portugués (pt_PT).
- Valenciano (va_ES).

Para localizar estos textos se deberán cumplir ciertas convenciones: 
- Se encontrarán dentro de un nodo HTML que incluya un atributo 'data-translate', u otro arbitrario 
  si se especifica como parámetro opcional (-p).
- Deberán estar aislados dentro de nodos HTML sin compartir la misma jerarquía otros nodos HTML.
  El objeto de esto es evitar censar contenido HTML como texto a traducir. Por ejemplo:

  Así NO: 
        <h1 data-translate="hello_world">Hola <strong>Mundo</strong></h1>
  Así SI: 
        <h1><span data-translate="hello">Hola</span> <strong data-translate="world">Mundo</strong></h1>

Uso:
  text2sql -h      Imprime este mensaje.
  text2sql <path>  Genera un script SQL a partir del archivo HTML en el path, con la configuración por defecto.
  
Opciones:  
  -f <fileName>    Nombre del archivo a generar con el script de sql (por defecto 'text_inserts.sql').
  -s <schema>      Nombre del esquema de BBDD a emplear (por defecto 'BEL').
  -c <comment>     Comentario a introducir en cada insert de la tabla (por defecto 'Creado con Text2SQL').
  -p <paramName>   Nombre del parámetro de traducciones a localizar en el documento HTML (por defecto 'data-translate').  
  
Ejemplos:
  text2sql index.html -f inserts.sql     
  text2sql index.html -f .sql/texts.sql
  text2sql index.html -f inserts.sql -c 'Traducir idiomas' 
  text2sql index.html -f inserts.sql -p custom-text
`);
  return;
}

if (filePath === undefined) {
  throw new Error('Se debe pasar como parámetro el path de un archivo HTML');
}

else if (process.argv.indexOf('-f') != -1) {
  fileName = process.argv[process.argv.indexOf('-f') + 1];
}

else if (process.argv.indexOf('-s') != -1) {
  scheme = process.argv[process.argv.indexOf('-s') + 1] || '';
}

else if (process.argv.indexOf('-c') != -1) {
  comment = process.argv[process.argv.indexOf('-c') + 1] || '';
}

else if (process.argv.indexOf('-p') != -1) {
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

  return `DELETE FROM ${scheme && scheme + '.'}BDPTB079_IDIOMA WHERE CODIGO in (\n${deletes}\n);\n\n${sql}`;
}

function mkDirIfNot(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  mkDirIfNot(dirname);
  fs.mkdirSync(dirname);
}

function writeToSQLFile(sql) {
  mkDirIfNot(fileName);
  fs.writeFile(fileName, sql, function (err) {
    if (err && err.code !== 'ENOENT') {
      throw err;
    }
    console.info('Script SQL escrito en ' + fileName);
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

