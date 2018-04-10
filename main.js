var express = require('express');
var ws      = require('./models/ws');
var v       = require('./models/validator');
let port = 4000;

process.argv.forEach(function (val, index, array) {
  if(val.startsWith("--port="))
  {
    port = val.split('=')[1];
    console.log('port '+ port);
  }
});
process.setMaxListeners(0);


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
app.get('/about', function (req, res)
{
 var data = {doc: 'xxx'};
 res.render('pages/index',data);
});

app.get('/', function (req, res)
{
  var data = {};
  data['start_url'] = req.query.doc;
  data['all']       = req.query.all;
  data['result']    = false;
  if(data['start_url'])
  {
    //data['result'] = v.start(start_url);
  }
  res.render('pages/index',data);
});

/**************************************************
Sever start
**************************************************/
app.listen(port, function () {
  console.log('Housekeeper App listening on port:'+ port)
})



