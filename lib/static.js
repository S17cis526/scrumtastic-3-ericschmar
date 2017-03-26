/** @module static
 * loads and serves static files
 */

module.exports = {
  loadDir: loadDir,
  isCached: isCached,
  serveFile: serveFile,
  update: update
}

var files = {};
var router;
var fs = require('fs');

function loadDir(directory, r){
  router = r
  var items = fs.readdirSync(directory);
  items.forEach(function(item) {
    var path = directory + '/' + item;
    var stats = fs.statSync(path);
    update(path)
    if(stats.isDirectory()){
      loadDir(path, router);
    }
  });
}

function update(path){
  var stats = fs.statSync(path);
  if(stats.isFile()) {
    var parts = path.split('.');
    var extension = parts[parts.length-1];
    var type = 'application/octet-stream';
    switch(extension) {
      case 'css':
        type = 'text/css';
        break;
      case 'js':
        type = 'text/javascript';
        break;
      case 'jpeg':
      case 'jpg':
        type = 'image/jpeg';
        break;
      case 'gif':
      case 'png':
      case 'bmp':
      case 'tiff':
      case 'svg':
        type = 'image/' + extension;
        break;
    }
    files[path] = {
      contentType: type,
    };
    router.get(path.substring(8), function(req, res){
      serveFile(path, req, res)
    });
  }
}

function isCached(path) {
  return files[path] != undefined;
}

function serveFile(path, req, res) {
  fs.readFile(path, function(err, body){
    if(err){
      res.statusCode = 500
      res.statusMessage = "internal serval error"
      res.end("Internal server error")
      return
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', files[path].contentType);
    res.end(body);
  })

}
