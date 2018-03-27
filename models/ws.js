var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 40511});
var spawn   = require('child_process').spawn;

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


function xsend(task)
{
  var count = 1;
  var c1 = '/var/customers/webs/controller/env/bin/python';
  var c2 = '/var/customers/webs/controller/controller.py';
  var c3 = task;
  //console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  wss.on('connection', function (ws,req) 
  {
    if(count == 1)
    {
      ws.send('start task :' + task);
      const ip = req.connection.remoteAddress;
      ws.send('your IP :' + ip);
      console.log(count);
      child    = spawn(c1,[c2,c3,'-u']);

      child.stdout.on('data', function (data) {
      var str = data.toString('utf8');
      //console.log(str);
      ws.send(str);
      });

     child.stderr.on('data', function (data) {
      var str = data.toString('utf8');
      ws.send('Error:' +str);
     });

     child.on('close', function(code) {
      ws.send('Task successfully completed....');
     });

    child.on('exit', function(code, signal) {
      console.log('exit');
      ws.send('exit....');
    });

    }
    count++;
  });

}

exports.xsend = xsend;
exports.set_id = set_id;



