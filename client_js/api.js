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
