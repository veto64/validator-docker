var express = require('express');
var path    = require('path');
var fs      = require('fs');
var ini     = require('ini');
var os      = require('os');
var ip      = require("ip");
var spawn   = require('child_process').spawn;
let port = 4000;
var ws      = require('./models/ws');


process.argv.forEach(function (val, index, array) {
  if(val.startsWith("--port="))
  {
    port = val.split('=')[1];
    console.log('port '+ port);
  }
});



/**************************************************
setup express
**************************************************/
var app  = express();
app.set('view engine', 'ejs');  
app.use(express.static('public'));
app.use(express.static('node_modules'));



/**************************************************
Routes
**************************************************/
app.get('/', function (req, res)
{
 var data = {};
 res.render('pages/index',{data:data});
});



/**************************************************
Sever start
**************************************************/
app.listen(port, function () {
  console.log('Housekeeper App listening on port:'+ port)
})

