var express = require('express');
var path    = require('path');
var exec    = require ( 'child_process' ).exec;
var spawn   = require('child_process').spawn; 
var vnu     = require ( 'vnu-jar' );
var fs      = require('fs');
var ini     = require('ini');
var os      = require('os');
var ip      = require("ip");
var spawn   = require('child_process').spawn;
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var ws      = require('./models/ws');
let port = 4000;

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
var start_url = req.query.doc;
var host = start_url;
var MAX_PAGES_TO_VISIT = 10000;
var pages_visited = {};
var num_pages_visited = 0;
var pages_to_visit = [];
var broken_links = [];
var url = new URL(start_url);
var baseUrl = url.protocol + "//" + url.hostname;

pages_to_visit.push(start_url);


crawl();
 var data = {
     doc: start_url
 };

 res.render('pages/index',data);


function validate_doc(url)
{
  console.log(url);
  const child = spawn('java',['-jar',`${vnu}`,'--format','json',url,'-u']);
  child.stderr.on('data', function (data) {
    var str = data.toString('utf8');
    console.log(str);
  });

}

function crawl() {
  if(num_pages_visited >= MAX_PAGES_TO_VISIT) {
    return;
  }
  var next_page = pages_to_visit.pop();
  if(next_page in pages_visited)
  {
    crawl();
  }
  else
  {
    if(next_page)
    {
      visit_page(next_page, crawl);
    }
  }
}

function visit_page(url, callback) {
  pages_visited[url] = true;
  num_pages_visited++;
  //console.log("Visiting page " + url);
  validate_doc(url);
  request(url, function(error, response, body)
  {
    if(response.statusCode !== 200)
    {
       callback();
       broken_links.push(url);
       return;
    }
     var $ = cheerio.load(body);
     $('a').each(function (){
      var link = $(this).attr('href').toLowerCase();

      if (! /^https?:\/\//.test(link))
      {
        if(link.indexOf('../') < 0)
        {
          var url2 =  host + '/' +link;
          pages_to_visit.push(url2);
        }
      }
      else
      {
       if(link.indexOf(host.toLowerCase()) === 0)
       {
         pages_to_visit.push(link);
       }
      }
     });     
     callback();
  });
}

});






/**************************************************
Sever start
**************************************************/
app.listen(port, function () {
  console.log('Housekeeper App listening on port:'+ port)
})




