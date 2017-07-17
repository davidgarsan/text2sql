#!/usr/bin/env node

const jsdom = require('jsdom');
const fs = require('fs');
const {JSDOM} = jsdom;
const help = require('./help');
const utils = require('./utils');
let conf;

if (process.argv.length == 3 && process.argv.indexOf('-h') != -1) {
  return help.print();
}

conf = utils.getParams();

JSDOM.fromFile(conf.filePath, {})
  .then(dom => {
    let list = Array.prototype.slice.call(dom.window.document.querySelectorAll(`[${conf.attrName}]`))
      .map(
        (o) => ({key: o.getAttribute(conf.attrName), value: o.textContent.trim()})
      );
    const uniq = new Set();

    list.forEach(e => uniq.add(JSON.stringify(e)));

    list = Array.from(uniq).map(e => JSON.parse(e));

    const sql = utils.buildSQL(list, conf);

    utils.writeToSQLFile(sql, conf);

  }).catch(console.error);
