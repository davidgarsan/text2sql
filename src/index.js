#!/usr/bin/env node

const path = require('path');
const jsdom = require('jsdom');
const fs = require('fs');
const {JSDOM} = jsdom;
const help = require('./help');
const utils = require('./utils');
let list = [];
let ext;
let conf;
let texts;

if (process.argv.length == 3 && process.argv.indexOf('-h') != -1) {
  return help.print();
}

conf = utils.getParams();
ext = path.extname(conf.filePath);

function buildSQL() {
  const uniq = new Set();
  const initCount = list.length;

  list.forEach(e => uniq.add(JSON.stringify(e)));

  list = Array.from(uniq).map(e => JSON.parse(e));

  const sql = utils.buildSQL(list, conf);
  const finalCount = list.length;

  conf.repeated = initCount - finalCount;

  utils.writeToSQLFile(sql, conf);
}

if(ext === '.json') {
  const absPath = path.resolve(conf.filePath);
  const json = require(absPath);
  conf.isJSON = true;
  for (let key in json) {
    if (json.hasOwnProperty(key)) {
      list.push({ key, value: json[key] });
    }
  }
  texts = new Promise(resolve => {
    buildSQL(list);

    resolve(list);
  });
} else {
  texts = JSDOM.fromFile(conf.filePath, {})
    .then(dom => {
      list = Array.prototype.slice.call(dom.window.document.querySelectorAll(`[${conf.attrName}]`))
        .map(
          (o) => ({key: o.getAttribute(conf.attrName), value: o.textContent.trim()})
        );

      buildSQL(list);

      return list;
    })
    .catch(console.error);
}

module.exports = {
  texts
};
