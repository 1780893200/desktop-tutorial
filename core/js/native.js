//加载JQuery
const $ = require('../static/jquery/jquery-3.5.1.min.js');
const { shell } = require('electron');


// const bootstrap = require('../static/bootstrap/bootstrap.bundle.min.js');

function openHttp(url){
  shell.openExternal(url);

}