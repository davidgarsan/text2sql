# Tex2SQL

Esta utilidad inspecciona documentos HTML, extrayendo los textos a traducir y 
generando un script SQL para su inserción en SQL.

## Instalación
1. Clonar Text2SQL del repositorio git:
  ```
  git clone https://github.com/davidgarsan/text2sql.git
  ```
1. Instalar la herramienta globalmente: 
  ```
  npm install -g ./text2sql 
  ```
1. Una vez finalizada la instalación será posible ejecutarla desde cualquier directorio:
  ```
  text2sql -h   
  ```
 

## Uso

* **text2sql -h**                   Imprime este mensaje
* **text2sql -f \<fileName>**              Nombre del archivo a generar con el script de sql, por defecto 'text_inserts.sql'
* **text2sql -s \<schema>**                Nombre del esquema de BBDD a emplear, por defecto 'BEL'
* **text2sql -c \<comment>**               Comentario a introducir en cada insert de la tabla, por defecto 'Creado con Text2SQL'
* **text2sql -p \<paramName>**             Nombre del parámetro de traducciones a localizar en el documento HTML, por defecto 'data-translate'  