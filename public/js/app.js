if(window.location.hostname.indexOf('127') === 0)
{
  var ws = new WebSocket('ws://127.0.0.1:40511');
}
else
{
  var ws = new WebSocket('ws://192.168.80.241:40511');
}

ws.onopen = function ()
{
  var top = document.getElementById('top');
  top.appendChild(document.createTextNode('Ready to check'));
  ws.send('connected');
}

ws.onmessage = function (ev)
{
  if(is_json(ev['data']))
  {
  }
};

