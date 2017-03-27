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
    addSubmitCallback()
    classes.forEach(function(c) {
        classDiv.append(createClassCard(c));
    });
}

function createNewClassDiv(){
  return $('<div id="newClassDiv" style="display: none;"><h1>Submit a New Class</p><form id="newClass" method="POST" enctype="multipart/form-data"><input type="text" name="class" placeholder="Class Name"><input type="text" name="description" placeholder="Class Metadata"><input type="file" name="image"><input type="submit" value="Submit Class"></form></div>');
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

function addSubmitCallback(){
  $("#newClass").submit(function() {
      var formData = new FormData($(this)[0]);

      api.postNewClass(formData, function(response){
        console.log(response);
        clearAndLoadAll()
      });
      return false;
  });
}


clearAndLoadAll();
$("#bannerImg").click(function() {
    clearAndLoadAll();
})

$("#button").click(function(){
  $("#newClassDiv").show()
})
