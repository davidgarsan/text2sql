const chalk = require('chalk');
const figlet = require('figlet');
const log = console.log;

module.exports = {
  print: function () {
    log(
      chalk.hex('#66cc10')(
        figlet.textSync('Text2SQL', { horizontalLayout: 'fitted'})
      )
    );

    log(chalk.bold('Text2SQL:'));

    log(`  Esta utilidad inspecciona documentos HTML, extrayendo los textos a traducir
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

  Por otro lado, en la tabla BDPTB079_IDIOMA_APLICATIVO se introducirá la información relativa a la aplicación.\n`);

    log(chalk.bold('Convenciones:'));

    log(chalk`  Para localizar estos textos se deberán cumplir ciertas convenciones:
  - Se encontrarán dentro de un nodo HTML que incluya un atributo 'data-translate', u otro arbitrario
    si se especifica como parámetro opcional (-p).
  - Deberán estar aislados dentro de nodos HTML sin compartir la misma jerarquía otros nodos HTML.
    El objeto de esto es evitar censar contenido HTML como texto a traducir. Por ejemplo:
    Así NO:
    {bgWhite.blue  <h1 {bold.red data-translate}="hello_world">Hola <strong>Mundo</strong></h1> }
    Así SI:
    {bgWhite.blue  <h1><span {bold.hex('#66cc10') data-translate}="hello">Hola</span> <strong {bold.hex('#66cc10') data-translate}="world">Mundo</strong></h1> }

`);

    log(chalk.bold('Uso:'));

    log(`  text2sql -h                Imprime este mensaje.
  text2sql <path> <appName>  Genera un script SQL a partir del archivo HTML en el path, con la configuración por defecto.
  `);

    log(chalk.bold('Parámetros:'));

    log(`  path                       Ruta al archivo HTML.
  appName                    Nombre que identificará a los textos de la aplicación.
    `);

    log(chalk.bold('Opciones:'));

    log(`  -f <fileName>              Nombre del archivo a generar con el script de sql (por defecto 'text_inserts.sql').
  -s <schema>                Nombre del esquema de BBDD a emplear (por defecto 'BEL').
  -c <comment>               Comentario a introducir en cada insert de la tabla (por defecto 'Creado con Text2SQL').
  -a <attrName>              Nombre del atributo de traducciones a localizar en el documento HTML (por defecto 'data-translate').
  -o <optionsApp>            Texto a introducir como opción adicional relativo a la aplicación.
  `);

    log(chalk.bold('Ejemplos:'));

    log(`  text2sql index.html CARDS_SIMULATOR
  text2sql index.html CARDS_SIMULATOR -f inserts.sql
  text2sql index.html CARDS_SIMULATOR -f ./sql/texts.sql
  text2sql index.html CARDS_SIMULATOR -c 'Traducir idiomas'
  text2sql index.html CARDS_SIMULATOR -f inserts.sql -p custom-text
  text2sql index.html CARDS_SIMULATOR -o 'Simulador de tarjetas'
`);

    log(chalk.bold('Limitaciones:'));

    log(`  Text2SQL busca textos en un solo archivo HTML, por lo que los textos mostrados dinámicamente con Javascript no serían localizados.
  Para evitar esto se añadirá cada texto dentro de un nodo HTML oculto, y se iniciarán como variables Javascript en la carga de la aplicación:
`);

    log(chalk`  {bgWhite.blue    <span id="texts" style="display: none">                                           }
  {bgWhite.blue      <span data-translate="texto_js_1">Texto de prueba 1</span>                      }
  {bgWhite.blue      <span data-translate="texto_js_2">Texto de prueba 2</span>                      }
  {bgWhite.blue      <span data-translate="texto_js_3">Texto de prueba 3</span>                      }
  {bgWhite.blue    </span>                                                                           }
  {bgWhite.blue    <script>                                                                          }
  {bgWhite.blue      var texto1 = document.querySelector('[data-translate=texto_js_1]').textContent; }
  {bgWhite.blue      var texto2 = document.querySelector('[data-translate=texto_js_2]').textContent; }
  {bgWhite.blue      var texto3 = document.querySelector('[data-translate=texto_js_3]').textContent; }
  {bgWhite.blue    </script>                                                                         }`);

    log(chalk.bold.hex('#d13a82')('\nHecho con \u2665 en OPC | RSI\n'));
  }
};