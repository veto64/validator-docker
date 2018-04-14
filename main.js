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
  data['start_url']   = req.query.doc;
  data['max_pages']   = req.query.max_pages   ? req.query.max_pages   : 1;
  data['issue_pages'] = req.query.issue_pages ? req.query.issue_pages : [];
  data['only_errors'] = req.query.only_errors ? true : false;
  data['revalidate']  = req.query.revalidate  ? true : false;

  if(typeof data['issue_pages'] === 'string' || data['issue_pages'] instanceof String)
  {
    var ip = [];
    ip.push(data['issue_pages']);
    data['issue_pages'] = ip;
  }
    
  data['res']    = {};
  data['page_options']  = [1,2,3,5,10,20,50,100];
  if(data['issue_pages'].length && data['revalidate'])
  {
    data['issue_pages'] = data['issue_pages'].filter(only_unique);
    data['res'] = v.issue_pages(data['issue_pages']);    
  }
  else if(data['start_url'])
  {
    data['res'] = v.start(data['start_url'],data['max_pages']);
    for( i in data['res'])
    {
     if(data['res'][i]['check']['messages'].length)
     {
       data['issue_pages'].push(i);
     }
    }
    data['issue_pages'] = data['issue_pages'].filter(only_unique);
  }
  
  res.render('pages/index',data);
});

/**************************************************
Sever start
**************************************************/
app.listen(port, function () {
  console.log('Housekeeper App listening on port:'+ port)
})



function only_unique(value, index, self) { 
    return self.indexOf(value) === index;
}
