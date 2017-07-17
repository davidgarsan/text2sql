# Text2SQL

Esta utilidad inspecciona documentos HTML, extrayendo los textos a traducir
y genera a partir de estos datos un script SQL para su inserción en BBDD.

El SQL generado insertará en la tabla **BDPTB079_IDIOMA**, después de un borrado preventivo,
los siguientes idiomas como preparación a su traducción:
- Catalán (*ca_ES*).
- Alemán (*de_DE*).
- Inglés (*en_UK*).
- Castellano (*es_ES*).
- Euskera (*eu_ES*).
- Francés (*fr_FR*).
- Gallego (*gl_ES*).
- Italiano (*it_IT*).
- Portugués (*pt_PT*).
- Valenciano (*va_ES*).

Por otro lado, en la tabla BDPTB079_IDIOMA_APLICATIVO se introducirá la información relativa a la aplicación.

## Convenciones

Para localizar estos textos se deberán cumplir ciertas convenciones: 
- Se encontrarán dentro de un nodo HTML que incluya un atributo `data-translate`, u otro arbitrario 
  si se especifica como parámetro opcional (_-p_).
- Deberán estar aislados dentro de nodos HTML sin compartir la misma jerarquía otros nodos HTML.
  El objeto de esto es evitar censar contenido HTML como texto a traducir. Por ejemplo:

  Así no: 
  ```
  <h1 data-translate="hello_world">Hola <strong>Mundo</strong></h1>
  ```
  Así sí: 
  ```
  <h1><span data-translate="hello">Hola</span> <strong data-translate="world">Mundo</strong></h1> 
  ```

## Instalación

1. Clonar Text2SQL del repositorio git:

  ```
  git clone <url_del_repositorio_git>
  ```
2. Instalar la herramienta globalmente: 

  ```
  npm install -g ./rsi-text2sql 
  ```
3. Una vez finalizada la instalación será posible ejecutarla desde cualquier directorio:

  ```
  text2sql -h   
  ```
 
## Uso

* **text2sql -h**                  Muestra la ayuda.
* **text2sql \<path> \<appName>**  Genera un script SQL a partir del archivo HTML en el `path`, con la configuración por defecto.

### Parámetros

* **path**                  Ruta al archivo HTML.
* **appName**               Nombre que identificará a los textos de la aplicación.

### Opciones

* **-f \<fileName>**       Nombre del archivo a generar con el script de sql, por defecto `text_inserts.sql`.
* **-s \<schema>**         Nombre del esquema de BBDD a emplear, por defecto `BEL`.
* **-c \<comment>**        Comentario a introducir en cada insert de la tabla, por defecto `Creado con Text2SQL`.
* **-p \<paramName>**      Nombre del parámetro de traducciones a localizar en el documento HTML, por defecto `data-translate`.
  
### Ejemplos

```
text2sql index.html -f inserts.sql
text2sql index.html -f .sql/texts.sql
text2sql index.html -f inserts.sql -c 'Traducir idiomas' 
text2sql index.html -f inserts.sql -p custom-text
```

## Limitaciones

Text2SQL busca textos en un solo archivo HTML, por lo que los textos mostrados dinámicamente con Javascript no serían localizados.

Para evitar esto se añadirá cada texto dentro de un nodo HTML oculto, y se iniciarán como variables Javascript en la carga de la aplicación:

```
<span id="texts" style="display: none">
    <span data-translate="texto_js_1">Texto de prueba 1</span>
    <span data-translate="texto_js_2">Texto de prueba 2</span>
    <span data-translate="texto_js_3">Texto de prueba 3</span>
</span>
<script>
    var texto1 = document.querySelector('[data-translate=texto_js_1]').textContent;
    var texto2 = document.querySelector('[data-translate=texto_js_2]').textContent;
    var texto3 = document.querySelector('[data-translate=texto_js_3]').textContent;
</script>
```

OPC | RSI