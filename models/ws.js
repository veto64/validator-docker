const WebSocket = require('ws');
var WebSocketServer = require('ws').Server;
var  v = require('./validator');
var wss = new WebSocketServer({
    port: 40511
});

wss.on('connection', function (ws,req) 
{
  ws.on('message', function (message)
  {
   var ret = v.js_start();
   ws.send(JSON.stringify(ret));
  });
});

function send_test()
{
  wss.on('connection', function (ws,req) 
  {
   ws.send(JSON.stringify({id:'progresbar',val:'1'}));
  });
}


function send_report(url,page,total,count)
{

wss.clients.forEach(function each(client) {
    client.send(JSON.stringify({id:'progressbar',val:count/total}));
  });


  wss.on('connection', function (ws,req) 
  {

  });
}




exports.send_report = send_report;
exports.send_test = send_test;




