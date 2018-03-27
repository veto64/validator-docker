window.onload = function () { 

var result = document.getElementById('result');
while (result.hasChildNodes()) {  
    list.removeChild(list.firstChild);
}

//var ws = new WebSocket('ws://192.168.80.241:40511');
var ws = new WebSocket('ws://127.0.0.1:40511');
ws.onopen = function ()
{
  var status = document.getElementById('status');
  status.appendChild(document.createTextNode('websocket is connected ...'));
  ws.send('connected');
}

ws.onmessage = function (ev)
{
  if(is_json(ev['data']))
  {
  }
};

function is_json(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function clean_element(e) {
  while (e.hasChildNodes())
  {  
    e.removeChild(e.firstChild);
  }
}

};
