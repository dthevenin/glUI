// var flo = require('fb-flo'),
//     path = require('path');
// 
// var server = flo(
//   ".",
//   {
//     port: 8001,
//     host: 'localhost',
//     verbose: false,
//     glob: ['*.js', '*.css']
//   },
//   null
// );

var express = require('express');
var app = express();
var http = require('http');

app.configure (function() {
  app.use (express.methodOverride());
  app.use (express.cookieParser ());
  app.use (express.bodyParser());
  app.use (function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
  app.use ("/openstreetmap", function(req, res, next) {

    var proxy = http.createClient (80, "tile.openstreetmap.org")
    var proxy_request = proxy.request (req.method, req.url, req.headers);
 
    proxy_request.addListener ('response', function (proxy_response) {
      proxy_response.addListener ('data', function(chunk) {
        res.write (chunk, 'binary');
      });
      proxy_response.addListener('end', function() {
        res.end ();
      });
      res.writeHead(proxy_response.statusCode, proxy_response.headers);
    });
  
    req.addListener('data', function(chunk) {
      proxy_request.write (chunk, 'binary');
    });
  
    req.addListener('end', function() {
      proxy_request.end ();
    });
  });
  app.use (express.static(__dirname));
  app.use (app.router);
});

var http = require('http');

app.get('/', function(req, res){
  res.send('hello world');
});


app.get ("/openstreetmap", function (req, res, next) {
  
  console.log ("proxy openstreetmap");
  
      next();
return;

  var url = req.url.replace ("/openstreetmap/", "http://tile.openstreetmap.org/");
  var proxy = http.createClient (80, "http://tile.openstreetmap.org/")
  var proxy_request = proxy.req (req.method, url, req.headers);
  
  proxy_request.addListener ('response', function (proxy_response) {
    proxy_response.addListener ('data', function(chunk) {
      res.write (chunk, 'binary');
    });
    proxy_response.addListener('end', function() {
      res.end ();
    });
    res.writeHead(proxy_response.statusCode, proxy_response.headers);
  });
  
  req.addListener('data', function(chunk) {
    proxy_request.write (chunk, 'binary');
  });
  
  req.addListener('end', function() {
    proxy_request.end ();
  });

});

app.listen (8000);
console.log('express running at http://localhost:%d', 8000);
