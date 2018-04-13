var sexec   = require ( 'child_process' ).execSync;
var spawn   = require('child_process').spawn; 
var spawns   = require('child_process').spawnSync; 
var path    = require('path');
var vnu     = require('vnu-jar');
var fs      = require('fs');
var ini     = require('ini');
var os      = require('os');
var ip      = require("ip");
var request = require('request');
var srequest = require('sync-request');
var cheerio = require('cheerio');
var URL     = require('url-parse');

global.pages_to_visit  = [];
var pages_to_validate  = {};
var num_pages_visited  = 0;
var broken_links      = [];

function issue_pages(pages)
{
  var ret = {};
  for(i in pages)
  {
   ret[pages[i]] = sync_validate(pages[i],'');
  }
  return ret;
}

function start(start_url,max_pages)
{
  global.start_url = start_url;
  var ret = {};
  var vpages = {};
  //vpages.push('http://apache2');
  //var child = spawns('java',['-jar',`${vnu}`,'--format','json',start_url,'-u']);
  //ret['error'] = child.stderr.toString().trim();
  global.pages_to_visit.push(start_url);
  while(global.pages_to_visit.length > 0 && Object.keys(vpages).length < max_pages)
  {
    var url = global.pages_to_visit.pop();
     if(! vpages.hasOwnProperty(url))
     {
       //console.log(Object.keys(vpages).length + '--'+ global.pages_to_visit.length);
       var body = visit_page(url,start_url);
       if(body)
       {
         vpages[url] = {"source":body,"check":false};
       }
     }
  }

  for(i in vpages)
  {
    ret[i] = sync_validate(i,vpages[i]['source']);
  }

  return ret;
}

function sync_validate(url,source)
{
    var child = spawns('java',['-jar',`${vnu}`,'--format','json',url,'-u']);
    var r = {
	"check":JSON.parse(child.stderr.toString().trim()),
	"source":source
    };
    return r;
}

function visit_page(url,start_url)
{
  res = srequest('GET',url);
  if(res.headers['content-type'].indexOf('text/html') != 0)
  {
    return false;
  }
  if(res.statusCode !== 200)
  {
    return false;
  }
  var body = res.body.toString('utf-8');
  var $ = cheerio.load(body);
  $('a').each(function (){
    var link = $(this).attr('href');
    if (! /^https?:\/\//.test(link))
    {
      if(link)
      {
        var full_url = absolute_link(start_url,url,link);
        global.pages_to_visit.push(full_url);
      }
    }
    else
    {
     if(link.indexOf(start_url.toLowerCase()) === 0)
     {
       global.pages_to_visit.push(link);
     }
    }
  });  
  return body;   
}




function js_start()
{
  return {id:'progressbar',val:1};
}


function crawl() {
  if(num_pages_visited >= MAX_PAGES_TO_VISIT)
  {
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
    else
    {
      validate();
    }
  }
}


function validate()
{
  (function theLoop (data,i) {
    var keys = Object.keys(data);
    setTimeout(function ()
    {
      if(keys[i])
      {
        //validate_doc(keys[i],keys.length);     
        //console.log(keys[i]);        
      }
      if (--i)
      {
        theLoop(data,i); 
      }
    },250);
    })(pages_to_validate,Object.keys(pages_to_validate).length);
}



var child = [];
function validate_doc(url,total)
{
  //console.log(url);
  //ws.send_report('validatex','ffff',1);
  child[url] = spawn('java',['-jar',`${vnu}`,'--format','json',url,'-u'],{detached: true});
  child[url].stderr.on('data', function (data) {
    var str = data.toString('utf8');
    pages_to_validate[url]['check'] = str;
    global.count++;
    ws.send_report(url,pages_to_validate[url],total,global.count);
    //ws.send_report('validatex','ffff',global.count);
  });

}



function visit_page2(url, callback) {
  pages_visited[url] = true;
  num_pages_visited++;
  //console.log("Visiting page " + url);
  //validate_doc(url);
  try {
  request(url, function(error, response, body)
  {
    if(response.headers['content-type'].indexOf('text/html') != 0)
    {
       callback();
       return;
    }
    if(response.statusCode !== 200)
    {
       callback();
       broken_links.push(url);
       //console.log("broken link: " + url);
       return;
    }
     pages_to_validate[url] = {'source':body,'check':''};
     var $ = cheerio.load(body);
     $('a').each(function (){
      var link = $(this).attr('href');

      if (! /^https?:\/\//.test(link))
      {
        if(link)
        {
          var full_url = absolute_link(host,url,link);
          pages_to_visit.push(full_url);
        }

      }
      else
      {
       if(link.indexOf(host.toLowerCase()) === 0)
       {
         //console.log(link);
         pages_to_visit.push(link);
       }
      }
     });     
     callback();
  });
  }
  catch (e)
  {
  }
}

function absolute_link(host,url,link)
{
  var _url = require('url');

  //_url.resolve(url, link);

  var base = url.split('/');
  var slink = link.split('/');
  if(host != url)
  {
    base.pop();
  }


  for(var x=0;x < slink.length;x++)
  {

    if (slink[x] == ".")
    {
      continue;
    }

    if (slink[x] == "..")
    {
      base.pop();
    }
    else
    {
      base.push(slink[x]);
    }

  }
  return base.join('/');

}



exports.start = start;
exports.issue_pages = issue_pages;




