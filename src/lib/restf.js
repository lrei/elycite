// elycite - "Restful" Helper Module

// (c) 2013-2014 Luis Rei, Josef Stefan Institute
// MIT License

var og = require('ogconfig.js');


// Creates the URL structure for a document
// things @TODO i should replace this with an automatic function
exports.url_for = function(what, which, where, inside) {
  var url = og.baseUrl;
  switch(what) {
    case "ontologies":
      url += "ontologies/";
      if(which !== undefined) {
        url += which + "/";
      }
      break;

    case "stores":
      url += "stores/";
      if(which !== undefined) {
        url += which + "/";
      }
      break;

    case "records":
      url += "stores/" + where + "/records/";
      if(which !== undefined && which !== null) {
        url += which + "/";
      }
      break;

    case "concepts":
      url += "ontologies/" + where + "/concepts/";
      if(which !== undefined && which !== null) {
        url += which + "/";
      }
      break;

    case "documents":
      url += "ontologies/" + where + "/documents/";
      if(which !== undefined && which !== null) {
        url += which + "/";
      }
      break;

    case "al":
      url += "ontologies/" + where + "/concepts/" + inside + "/al/" + which + "/";
      break;
  case "classifiers":
      url += "ontologies/" + where + "/classifiers/" + which + "/";
      break;
  }

  return url;
};

// JS helpper function for identifying what type of object
// e.g. what_is(records) === "[object Array]"
var what = Object.prototype.toString;
exports.what_is = function(x) {
  return what.call(x);
};

// Get pagination arguments from req or defaults
exports.paginationArguments = function(req, per_page) {
  // Args
  var args = {};
  var pargs = {};

  if(req.hasOwnProperty("args")) {
    args = req.args;
  }
  // Get Pagination Arguments
  pargs.page = 0;
  if(args.hasOwnProperty('page')) {
    pargs.page = parseInt(args.page, 10);
  }
  pargs.per_page = per_page || og.DOCS_DEFAULT_PAGE_SIZE;
  if(args.hasOwnProperty('per_page')) {
    pargs.per_page = parseInt(args.per_page, 10);
  }
  pargs.summarize = true;
  if(args.hasOwnProperty('summarize')) {
      pargs.summarize = Boolean(args.summarize[0]);
  }

  return pargs;
};

// Helper function for requiring certain properties in request JSON data.
// Handles sending the appropriate error responses.
// Returns null in case of missing properties or the JSON data otherwise.
// Example; requireJSON(req, res, "ontology", "name", "record")
exports.requireJSON = function() {
  if(arguments.length < 2) {
    throw "Invalid arguments: requireJSON(req, res, properties...)";
  }
  var req = arguments[0]; var res = arguments[1];
  if(!req.hasOwnProperty("jsonData")) {
    res.setStatusCode(400);
    res.send("Missing JSON data.");
    return null;
  }
  var data = req.jsonData;
  
  for(var ii = 2; ii < arguments.length; ii++) {
    if(!data.hasOwnProperty(arguments[ii])) {
      res.setStatusCode(400);
      var message = "Missing property " + arguments[ii] + ".";
      res.send(message);
      return null;
    } 
  }
  return data;
};

// Helper function for requiring certain URL parameters to be present.
// Handles sending the appropriate error responses.
// Returns null in case of missing properties or the params object otherwise.
// Exampe:
exports.requireParams = function() {
  if(arguments.length < 2) {
    throw "Invalid arguments: requireParams(req, res, properties...)";
  }
  var req = arguments[0]; var res = arguments[1];

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing request parameters");
    return;
  }
  var params = req.params;

  for(var ii = 2; ii < arguments.length; ii++) {
    if(!params.hasOwnProperty(arguments[ii])) {
      res.setStatusCode(400);
      var message = "Missing parameter " + arguments[ii] + ".";
      res.send(message);
      return null;
    } 
  }
  return params;
};

// Helper function for requiring that a parameter be an integer
exports.requireInt = function(res, name, value) {
  var parsed = parseInt(value, 10);
  if(isNaN(parsed)) {
    res.setStatusCode(400);
    res.send("Invalid " + name + ": " + value + ".");
    return null;
  }
  return parsed;
};

// javascript isArray
function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

// Helper function for requiring that a parameter be an array
exports.requireArray = function(res, name, value) {
  if(!isArray(value)) {
    res.setStatusCode(400);
    res.send("Invalid " + name + ": " + value + ". Should be array.");
    return null;
  }
  return value;
};

// Helper function for requiring certain HTTP GET arguments to be present.
// Handles sending the appropriate error responses.
// Returns null in case of missing properties or the args object otherwise.
// Exampe:
exports.requireArgs = function() {
  if(arguments.length < 2) {
    throw "Invalid arguments: requireArgs(req, res, properties...)";
  }
  var req = arguments[0]; var res = arguments[1];

  if(!req.hasOwnProperty("args")) {
    res.setStatusCode(400);
    res.send("Missing request arguments.");
    return;
  }
  var args = req.args;

  for(var ii = 2; ii < arguments.length; ii++) {
    if(!args.hasOwnProperty(arguments[ii])) {
      res.setStatusCode(400);
      var message = "Missing argument " + arguments[ii] + ".";
      res.send(message);
      return null;
    } 
  }
  return args;
};

//
exports.requireNotDeleted = function(rec, name) {
  if(rec.isDeleted) {
    res.setStatusCode(410);
    res.send(name + " '" + rec.$id + "' has been deleted.");
    return null;
  }
  return rec;
};

// Get stopwords from an object, use a default value or the global default
exports.stopwordsFromObj = function(obj, langopts, defaultval) {
  var stopwords = defaultval || og.DEFAULT_STOPWORDS;

  if(!obj) { return stopwords; }
  var arg = obj.stopwords || null;
  if(!arg) { return stopwords; }
  if(exports.what_is(arg) === "[object Array]") { arg = arg[0]; }

  if(langopts.stopwords.indexOf(arg) >= 0) {
    stopwords = arg;
  }
  return stopwords;
};

// Get stemmer from an object, use a default value or the global default
exports.stemmerFromObj = function(obj, langopts, defaultval) {
  var stemmer = defaultval || og.DEFAULT_STEMMER;

  if(!obj) { return stemmer; }
  var arg = obj.stemmer || null;
  if(!arg) { return stemmer; }
  if(exports.what_is(arg) === "[object Array]") {arg = arg[0]; }

  if(langopts.stemmer.indexOf(arg) >= 0) {
    stemmer = arg;
  }
  return stemmer;
};

// Helper for optional parameters, arguments, etc
exports.optional = function(obj, key, defaultval, validator) {
  var val = defaultval; // start with default
 
  // replace with property if it exists
  if(obj.hasOwnProperty(key)) {
    val = obj[key];
    // prevent empty args list
    if(exports.what_is(obj[key]) === '[object Array]') {
      if(obj[key].length == 1) {
        if(!obj[key][0]) {
          val = defaultval;
        }
      }
    }
  }
  
  // optional validator function
  if(validator) {
    if(!validator(val)) {
      val = defaultval;
    }
  }

  return val;
};

// Helper for optional parameters, arguments, etc that are integers
exports.optionalInt = function(obj, key, defaultval) {
  var val = defaultval;
  if(obj.hasOwnProperty(key)) {
    val = parseInt(obj[key], 10) || defaultval;
  }
  return val;
};
// Helper for optional values that are floats (used for cls params)
exports.optionalFloat = function(obj, key, defaultval) {
  var val = defaultval;
  if(obj.hasOwnProperty(key)) {
    val = parseFloat(obj[key]) || defaultval;
  }
  return val;
};

// Helper for optional values that are positive floats (used for cls params)
exports.optionalPosFloat = function(obj, key, defaultval) {
  var val = exports.optionalFloat(obj, key, defaultval);
  if (val <= 0) {
    val = defaultval;
  }
  return val;
};

// Verifies if it is safe/possible to create a URL from this string
exports.isValidName = function(name) {
  // prevent empty names (and nulls, undefined, nans)
  if(!name) { 
    return false;
  }
  // ensure string
  if (typeof name !== "string") {
    return false;
  }
  // extremely restrictive use of names: alphanum + underscore
  if(name.match(/^[0-9a-zA-Z_]+$/) === null) {
    return false;
  }
  return true;
};
