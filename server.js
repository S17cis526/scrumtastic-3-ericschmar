"use strict";

var PORT = 3000;

var fs = require('fs');
var http = require('http');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('scrumtastic.sqlite3', function(err) {
  if(err) console.error(err);
});
var staticFiles = require('./lib/static')

var router = new (require('./lib/route')).Router(db);
staticFiles.loadDir('./public', router);


router.get('/', function(req, res) {
  fs.readFile('public/index.html', function(err, body){
    res.end(body);
  });
});


var project = router.resource('/classes', require('./src/resource/classes.js'))


var migrate = require('./lib/migrate');
migrate(db, 'migrations', function(err){
/*
  fs.readFile('public/Diablo-II-icon.png', function(err, body) {
    if(err) console.log(err)
    db.run('INSERT INTO projects (name, description, image) VALUES (?,?,?)', ['diabloII', 'icon', body], function(err){
      if(err) console.log(err)
    })
  })*/


  var server = new http.Server(function(req, res) {
    router.route(req, res);
  });
  server.listen(PORT, function(){
    console.log("listening on port " + PORT);
  });

});
