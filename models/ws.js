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

function set_id(id,val)
{
  wss.on('connection', function (ws,req) 
  {
     ws.send(JSON.stringify({id:id,val:val}));
  });
}




exports.set_id = set_id;



