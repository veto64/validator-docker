var WebSocketServer = require('ws').Server;
var spawn   = require('child_process').spawn;
var wss = new WebSocketServer({
    port: 40511
});

wss.on('connection', function (ws) 
{
  ws.on('message', function (message)
  {
    console.log('received: %s', message);
  });

});

function send_report(url,pages,c)
{
   if(url == 'http://apache/index.html')
   {
     console.log(url);
     console.log(Object.keys(pages).length);
     console.log(c);
     console.log(pages[url]);
   }
  // console.log(pages[url]['check']);
  //wss.on('connection', function (ws,req) 
  //{
     //ws.send(JSON.stringify({id:id,val:val}));

  //});

}




exports.send_report = send_report;



