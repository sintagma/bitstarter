var express = require('express');
var app = express.createServer(express.logger());
var fs = require('fs');

app.get('/', function(request, response) {
  var buffer = fs.readFileSync('index.html');
  var text = buffer.toString('utf-8');
  response.send(text);
});

/* serves all the static files */
 app.get(/^(.+)$/, function(request, response){ 
  var buffer = fs.readFileSync(__dirname + request.params[0]);
  var text = buffer.toString('utf-8');
  response.send(text);
 });


var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
