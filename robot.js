var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var start_url = "http://127.0.0.1";
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
  console.log("Visiting page " + url);
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

