/** @module projects
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

/** @function list
  * Sends a list of all projects as a JSON array.
  */
function list(req, res, db) {
  db.all("SELECT * FROM projects", [], function(err, projects) {
    if(err) {
      console.error(err)
      res.statusCode = 500
      res.end("Server Error")
      return
    }
    res.setHeader("Content-Type", "text/json")
    res.end(JSON.stringify(projects))
  });
}

/** @function create
  * Creates a new priject and add it to the database
  */
function create(req, res, db) {
  var body = ""

  req.on("error", function(err) {
    console.error(err)
    req.statusCode = 500
    req.end("Server Error")
  });

  req.on("data", function(data){
    body += data
  });

  req.on("end", function(){
    var project = JSON.parse(body)
    db.run("INSERT INTO projects (name, description, version, repository, license) VALUES (?,?,?,?,?)",
    [project.name, project.description, project.version, project.repository, project.license], function(err) {
      if(err){
        console.error(err)
        res.statusCode = 500
        res.end("Could not insert project into database.")
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
  db.get("SELECT * FROM projects where id=?", [id], function(err, project){
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
  var body = ""

  req.on("error", function(err) {
    console.error(err)
    req.statusCode = 500
    req.end("Server Error")
  });

  req.on("data", function(data){
    body += data
  });

  req.on("end", function(){
    var project = JSON.parse(body)
    db.run("UPDATE projects SET name=? description=? version=? repository=? license=? where id=?",
    [project.name, project.description, project.version, project.repository, project.license, id], function(err) {
      if(err){
        console.error(err)
        res.statusCode = 500
        res.end("Could not update project in database.")
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
  db.run("DELETE * FROM projects where id=?", [id], function(err){
    if(err){
      console.error(err)
      req.statusCode = 500
      req.end("Server error")
    }
    req.statusCode = 200
    req.end()
  })
}
