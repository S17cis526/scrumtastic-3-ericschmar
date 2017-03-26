(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  getclasses: getclasses,
  getClassByID: getClassByID,
  postNewClass: postNewClass
};

function getclasses(callback) {
  $.ajax({
      "url": "./classes/",
      success: function(result) {
        callback(result);
      }
  });
}

function getClassByID(id, callback){
  $.ajax({
      "url": "./classes/" + id,
      success: function(result) {
        callback(result);
      }
  });
}

function postNewClass(form, callback) {
    var settings = {
        "async": true,
        "url": "./classes/",
        "method": "POST",
        "headers": {
            "cache-control": "no-cache",
        },
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    }

    $.ajax(settings).done(function(response) {
        callback(response);
    });

    return false;
}

},{}],2:[function(require,module,exports){
var api = require('./api.js');


function clearAndLoadAll() {
    clearContent();
    api.getclasses(function(classes) {
        insertclasses(classes);
    });
}

function clearContent() {
    $('div.container').empty();
}


function insertclasses(classes) {
    var classDiv = $('div.container')
    classDiv.append(createNewClassDiv());
    classes.forEach(function(c) {
        classDiv.append(createClassCard(c));
    });
}

function createNewClassDiv(){
  return $('<div id="newClass" style="display: none;"><h1>Submit a New Class</p><form id="newClass" method="POST" enctype="multipart/form-data"><input type="text" name="class" placeholder="Class Name"><input type="text" name="description" placeholder="Class Metadata"><input type="file" name="Image file"><input type="submit" value="Submit Class"></form></div>');
}

function clearAndLoad(id) {
    clearContent();
    api.getClassByID(id, function(c) {
        var classDiv = $('div.container');
        var html = '<div><h2>' + c.name + '</h2><img id="detailImg" src="' + c.image + '" alt="' + c.name + '">';
        html += '<p id="detailP">' + c.description + '</p></div>'
        classDiv.html(html);
    });
}

function createClassCard(c) {
    var div = $('<div><h2>' + c.name
    + '</h2>'
    + '<img src="' + c.image
    + '" alt="' + c.name
    + '">' + c.description
    + '</div>');

    div.click(function() {
        clearAndLoad(c.id);
    });

    return div;
}

$("#newClass").submit(function() {
    var formData = new FormData($(this)[0]);

    api.postNewClass(formData, function(response){
      console.log(response);
    });

    return false;
});

clearAndLoadAll();
$("#bannerImg").click(function() {
    clearAndLoadAll();
})

$("#button").click(function(){
  $("#newClass").show()
})

},{"./api.js":1}]},{},[2]);
