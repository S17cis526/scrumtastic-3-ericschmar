/** @module classes
* a RESTFUL resource representing a software project
* implementing the L-CRUD methods
*/

"use strict";

module.exports =  {
  list: list,
  create: create,
  read: read,
  update: update,
  destroy: destroy
};

var fs = require('fs')
var staticFiles = require('../../lib/static')

/** @function list
  * Sends a list of all classes as a JSON array.
  */
function list(req, res, db) {
  db.all("SELECT * FROM classes", [], function(err, classes) {
    if(err) {
      console.error(err)
      res.statusCode = 500
      res.end("Server Error")
      return
    }
    res.setHeader("Content-Type", "text/json")
    res.end(JSON.stringify(classes))
  });
}

/** @function create
  * Creates a new priject and add it to the database
  */
function create(req, res, db) {
  console.log(req.body)
    fs.writeFile('./public/images/' + req.body.image.filename, req.body.image.data, function(err) {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            res.statusMessage = "Server Error";
            res.end("Server Error");
            return;
        }
        staticFiles.update('./public/images/' + req.body.image.filename)
        db.run("INSERT INTO classes (name, description, image) VALUES (?,?,?)", [req.body.class, req.body.description, './images/' + req.body.image.filename], function(err) {
          if(err){
            console.error(err)
            res.statusCode = 500
            res.end("Could not insert class into database.")
            return
          }
          res.statusCode = 200
          res.end()
        });
      });
}

/** @function readFile
  * serves a specific project as a JSON stringify
  */
function read(req, res, db) {
  var id = req.params.id
  db.get("SELECT * FROM classes where id=?", [id], function(err, project){
    if(err){
      console.error(err)
      req.statusCode = 500
      req.end("Database error")
      return
    }
    if(!project){
      req.statusCode = 404
      req.end("Project doesn't exist")
      return
    }
    res.setHeader("Content-Type", "text/json")
    res.end(JSON.stringify(project))
  })
}

/** @function update
  * Updates a specific record with the supplied values
  */
function update(req, res, db){
  var id = req.params.id

  fs.writeFile('./public/images/' + req.body.image.filename, req.body.image.data, function(err) {
      if (err) {
          console.error(err);
          res.statusCode = 500;
          res.statusMessage = "Server Error";
          res.end("Server Error");
          return;
      }
      staticFiles.update('./public/images' + req.body.image.filename)
      db.run("UPDATE classes SET name=?, description=?, image=?", [req.body.class, req.body.description, './images/' + req.body.image.filename], function(err) {
        if(err){
          console.error(err)
          res.statusCode = 500
          res.end("Could not insert class into database.")
          return
        }
        res.statusCode = 200
        res.end()
      });
    });
}


/** @function destroy
  * Removes the specified project from the database
  */
function destroy(req, res, db){
  var id = req.params.id
  db.run("DELETE FROM classes where id=?", [id], function(err){
    if(err){
      console.error(err)
      res.statusCode = 500
      res.end("Server error")
    }
    res.statusCode = 200
    res.end()
  })
}
