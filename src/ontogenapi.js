import "util.js"
import "test.js"

/*
 * Config, URLs, Default Options, etc
 */
var docsJoinName = "docs";
var childJoinName = "childOf";
var docsFieldName = "text";

var ontoPrefix = "onto_"; // ontology storeName prefix
var ontoRegex = /^onto_/; // ontology storeName prefix regex
var baseUrl = "/ontogenapi/";
var DEFAULT_STOPWORDS = "none";
var DEFAULT_STEMMER = "none";
var DEFAULT_SUGGESTIONS = 2;
var DEFAULT_ITER = 50;
var DEFAULT_NUM_KEYWORDS = 10;
var DOCS_SUMMARY_SIZE = 30;  // "summary" size when docs list is sent to client
var DOCS_DEFAULT_PAGE_SIZE = 300;  // default page size in docs list

// @TODO replace this with an automatic function
var url_for = function(what, which, where, inside) {
  var url = baseUrl;
  switch(what) {
    case "ontologies":
      url += "ontologies/";
      if(typeof which != 'undefined') {
        url += which + "/";
      }
      break;

    case "stores":
      url += "stores/";
      if(typeof which != 'undefined') {
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

var what = Object.prototype.toString;
var what_is = function(x) {
  return what.call(x);
};

var ontologyNameFromStoreName = function(storeName) {
  return storeName.replace(ontoRegex, "");
};

var docStoreNameFromOntoStore = function(store, ontology) {
  // get document store from ontology
  var onto = qm.getStoreList().filter(function(store) {
    return store.storeName === ontology;
  })[0];
  var docStoreName = onto.joins.filter(function(join) {
    return join.joinName === docsJoinName;
  })[0].joinStoreName;
  return docStoreName;
};

var conceptFromRecord = function(rec, ontology) {
  var c = rec.toJSON(true);
  if(!c.hasOwnProperty("parent")) {
    c.parentId = -1;
  }
  else {
    c.parentId = c.parent.$id;
    delete c.parent;
  }
  delete c.docs;
  delete c[childJoinName];
  c.ontology = ontology;
  c.links = {};
  c.links.self = url_for("concepts", c.$id, ontology);
  c.links.ontology = url_for("ontologies", ontology);
  return c;
};

var documentFromRecord = function(rec, ontology, field, summary) {
  var d = {};
  if (field === null) {
    d = rec.toJSON();
  }
  // only use one field
  else {
    d.$id = rec.$id;
    // "summarize" it
    if(summary) {
      // dont think summary will be needed for other datatypes but
      // if it is, they can be added here
      if(typeof rec[field] === "string")
        d[field] = rec[field].substring(0, DOCS_SUMMARY_SIZE);
      else
        d[field] = rec[field];
    }
    // dont "summarize" it
    else {
      d[field] = rec[field];
    }
  }
  //d.ontology = ontology;
  d.links = {};
  d.links.self = url_for("documents", d.$id, ontology);
  //d.links.ontology = url_for("ontologies", ontology);
  return d;
};

var paginatedDocuments = function(recSet, ontology, field, page, per_page, summarize) {
  // Get the documents
  var docs = [];
  // calculate start
  var start = page * per_page;
  // calculate end
  var end = page * per_page + per_page;
  if(end > recSet.length)
    end = recSet.length;
  for (var ii = start; ii < end; ii++) {
    var d = documentFromRecord(recSet[ii], ontology, field, summarize);
    docs.push(d);
  }
  return docs;
};


var classifierFromName = function(name, ontology) {
  var c = {"id": name};
  c.links = {};
  c.links.self = url_for("classifiers", name, ontology);
  c.links.ontology = url_for("ontologies", ontology);
  return c;
};

var randomPosInt32 = function() {
  var max = 2147483647;
  var min = 0;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function RootConcept(docStore, swords, stmr) {
  var stopwords = swords || DEFAULT_STOPWORDS;
  var stemmer = stmr || DEFAULT_STEMMER;

  var concept = {
    name: "root",
    keywords: "",
    stopwords: stopwords,
    stemmer: stemmer,
    parentId: -1,
    isDeleted: false
  };
  var docs = [];
  for(var ii = 0; ii < docStore.length; ii++) {
    docs.push({$id: docStore[ii].$id});
  }
  concept[docsJoinName] = docs;
  return concept;
}

// Checks the parent
var checkParentId = function(store, pid, res) {
  var parentId;
  // gracefully handle parentId sent as string instead of number 
  if (pid === "string") {
    parentId = parseInt(pid);
  }
  else { 
    parentId = pid;
  }

  // handle invalid parentId value
  if(isNaN(parentId) || parentId < 0) {
    res.setStatusCode(400);
    res.send("Invalid parent id:" + parentId);
    return null;
  }
  var parentConcept = store[parentId];
  if(parentConcept === null) {
    res.setStatusCode(404);
    res.send("concept '" + parenttId + "' (parent) not found");
    return null;
  }
  if(parentConcept.isDeleted) {
    res.setStatusCode(410);
    res.send("concept '" + parenttId + "' (parent) has been deleted.");
    return null;
  }

  return parentId; // Success
};
 
// Language Options
http.onRequest("languageoptions", "GET", function(req, res) {
  console.say("OntoGen API - Language Options");

  var LangOpts = qm.analytics.getLanguageOptions();
  
  res.send(LangOpts);
});


/*
 * Stores
 */
// Get List of Stores
http.onRequest("stores", "GET", function(req, res) {
  console.say("OntoGen API - GET Stores");
  var dataStores = qm.getStoreList().filter(function(store) {
    return store.storeName.indexOf(ontoPrefix) !== 0;
  });
  // build ontology objects
  var rdata = dataStores.map(function(store) {
    store.links = {};
    store.links.self = url_for("stores", store.storeName);
    return store;
  });
  res.send(rdata);
});


http.onRequest("stores/", "POST", function(req, res) {
  if(!req.hasOwnProperty("jsonData")) {
    res.setStatusCode(400);
    res.send("Missing data.");
    return;
  }
  var data = req.jsonData;
  if(!data.hasOwnProperty("storeName")) {
    res.setStatusCode(400);
    res.send("Missing store name.");
    return;
  }
  var storeName = req.jsonData.storeName;

  if(!data.hasOwnProperty("records")) {
    res.setStatusCode(400);
    res.send("Missing records.");
    return;
  }
  var records = data.records;
  if(what_is(records) != "[object Array]") {
    res.setStatusCode(400);
    res.send("Records must be an array not " + what_is(records) + ".");
    return;
  }
  if(records.length === 0) {
    res.setStatusCode(400);
    res.send("Records array is empty.");
    return;
  }
  var proto = records[0];
  if(what_is(proto) != "[object Object]") { 
    res.setStatusCode(400);
    res.send("Records (array elements) must be JSON not " + what_is(proto) + ".");
    return;
  }
  // build datastore schema from first object
  // Only JS native JSON serializable types are supported at the moment:
  // Number (float), String, arrays of these, plus Boolean.
  // all numbers are assumed to be float, JS has only Number and there 
  // is reliable way to tell 1.0 apart from 1.In the interest of reliability
  // Number is always assumed to be float.
   var storeDef = [{
    "name": storeName,
    "fields":  []
  }];
  var used_keys = [];
  for (var key in proto) {
    var el = proto[key];
    switch(what_is(el)) {
    case "[object Number]":
      if(key === "id" || key === "$id") {
        storeDef[0].fields.push({name:key, type:"int", primary:true}); 
      }
      else {
        storeDef[0].fields.push({name:key, type:"float", primary:false}); 
      }
      used_keys.push(key);
      break;
    case "[object String]":
      storeDef[0].fields.push({name:key, type:"string", primary:false});
      used_keys.push(key);
      break;
    case "[object Boolean]":
      storeDef[0].fields.push({name:key, type:"bool", primary:false});
      used_keys.push(key);
      break;
    case "[object Array]":
      if(el.length === 0) { break; } // that's too bad @warning
      var first = el[0];
      switch(what_is(el)) {
        case "[object Number]":
          used_keys.push(key);
          storeDef[0].fields.push({name:key, type:"oftFltV", primary:false}); 
          break;
        case "[object String]":
          used_keys.push(key);
          storeDef[0].fields.push({name:key, type:"oftStrV", primary:false});
          break;
      } // end of array switch
      break; // explecitly break out of array case
    } // end of datatype switch
  } // end of for loop for each key in object

  // schema is ready, add it to database
  qm.createStore(storeDef);
  // Successful?
  var store = qm.store(storeName);
  if(store === null) {
    res.setStatusCode(500);
    res.send("Unable to create store.");
    return;
  }

  // ok we have our store, now lets add the records
  for(var ii = 0; ii < records.length; ii++) {
    var recVal = {};
    for(var kk = 0; kk < used_keys.length; kk++) {
      var keyname = used_keys[kk];
      recVal[keyname] = records[ii][keyname]; 
    }
    store.add(recVal);
  }

  // @TODO newsfeed, twitter
  // newsfeed: {username, password, timestamp, max}
  // will need a temporary resource until finished
  // how to mark finished?
  // for now, only allow {$id, text} stores
  
  var storeObj = qm.getStoreList().filter(function(store) {
    return store.storeName === storeName;
  })[0];

  //res.setStatusCode(201);
  res.send(storeObj);
});

// Get Store info @TODO

/*
 * Ontologies
 */
var listOntologies = function() {
  var ontologies = qm.getStoreList().filter(function(store) {
    return store.storeName.indexOf(ontoPrefix) === 0;
  });
  return ontologies;
};

// Get List of Existing Ontologies
http.onRequest("ontologies", "GET", function(req, res) {
  console.say("OntoGen API - GET Existing Ontologies");
  var ontologies = listOntologies(); 
  // build ontology objects
  var rdata = ontologies.map(function(onto) {
    onto.links = {};
    onto.links.self = url_for("ontologies", onto.storeName);
    onto.links.concepts = url_for("concepts", null, onto.storeName);
    onto.name = ontologyNameFromStoreName(onto.storeName);
    return onto;
  });
  res.send(rdata);
});

/// Create - New Ontology
// - Body should countain {ontologyName: "", dataStore: "", dataField: ""}
http.onRequest("ontologies", "POST", function(req, res) {
  console.say("OntoGen API - Create Ontologies: " + JSON.stringify(req));

  if(!req.hasOwnProperty("jsonData")) {
    res.setStatusCode(400);
    res.send("Missing data.");
    return;
  }
  var data = req.jsonData;
  if(!data.hasOwnProperty("ontologyName") || !data.hasOwnProperty("dataStore")) {
    res.setStatusCode(400);
    res.send("Missing ontology name and/or dataStore properties.");
    return;
  }
  
  var dataStoreName = req.jsonData.dataStore;
  var dataStore = qm.store(dataStoreName);
  if(dataStore === null) {
    res.setStatusCode(400);
    res.send("Data Store '" + dataStoreName + "' not found");
    return;
  }
  var ontologyName = req.jsonData.ontologyName;
  // verify if storeName starts with prefix if not, add prefix
  if(ontologyName.indexOf(ontoPrefix) !== 0) {
    ontologyName = ontoPrefix + ontologyName; // add prefix
  }
  // check if ontology already exists
  if(qm.store(ontologyName) !== null) {
    res.setStatusCode(409);
    res.send("An ontology with the specified name already exists");
    return;
  }

  var storeDef = [{
    "name": ontologyName,
    "fields":  [
      { "name": "name", "type": "string", "primary":false},
      { "name": "keywords", "type": "string", "primary":false},
      { "name": "stopwords", "type": "string", "primary":false},
      { "name": "stemmer", "type": "string", "primary":false},
      { "name": "isDeleted", "type": "bool", "primary":false, "default":false}
    ],
    "keys": [
      {"field": "name", "type": "value"}
    ],
    "joins": [
      {"name" : docsJoinName, "type" : "index",  "store" : dataStoreName},
      {"name": "parent", "type": "field", "inverse": childJoinName, "store": ontologyName},
      {"name": childJoinName, "type": "index", "store": ontologyName, "inverse" : "parent" }
    ]
  }];

  // create ontology
  qm.createStore(storeDef);
  // Successful?
  var s = qm.store(ontologyName);
  if(s === null) {
    res.setStatusCode(500);
    res.send("Unable to create ontology");
    return;
  }

  // create root concept
  var swords = req.jsonData.stopwordList || null;
  var stmr = req.jsonData.stemmer || null;
  var root = new RootConcept(dataStore, swords, stmr);
  s.add(root);

  res.setStatusCode(201);

  var onto = qm.getStoreList().filter(function(store) {
    return store.storeName === ontologyName;
  })[0];
  // build ontology object
  onto.links = {
    "self": url_for("ontologies", ontologyName),
    "concepts":  url_for("concepts", null, ontologyName)
  };

  res.send(onto);
});


/// Read ontology definition 
http.onRequest("ontologies/<ontology>/", "GET", function (req, res) {
  console.say("OntoGen API - Concept ontology def");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  var onto = qm.getStoreList().filter(function(store) {
    return store.storeName === params.ontology;
  })[0];
  // build ontology object
  onto.links = {
    "self": url_for("ontologies", onto.storeName),
    "concepts":  url_for("concepts", null, onto.storeName)
  };
  res.send(onto);
});

/*
 * Document
 */

/// Read - Get Al Documents - Summaries Only
// @TODO add query parameter here
//       docsFieldName will need to be changed to query parameter
//       check if pagination should be handled by http range header
http.onRequest("ontologies/<ontology>/documents/", "GET", function (req, res) {
  console.say("OntoGen API - Document GET ALL");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  var ontology = params.ontology;

  // Args
  var args = {};
  if(req.hasOwnProperty("args")) {
    args = req.args;
  }
  // Get Pagination Arguments
  var page = 0;
  if(args.hasOwnProperty('page')) {
    page = parseInt(args.page);
  }
  var per_page = DOCS_DEFAULT_PAGE_SIZE;
  if(args.hasOwnProperty('per_page')) {
    per_page = parseInt(args.per_page);
  }
  var docStoreName = docStoreNameFromOntoStore(store, ontology);
  var docStore = qm.store(docStoreName);

  var summarize = true;
  var docs = paginatedDocuments(docStore.recs, ontology, docsFieldName, page,
                                per_page, summarize);  

  res.send(docs);
});

// Read Document
http.onRequest("ontologies/<ontology>/documents/<did>/", "GET", function (req, res) {
  console.say("OntoGen API - Document<did> GET");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  var ontology = params.ontology;

  var docStoreName = docStoreNameFromOntoStore(store, ontology);
  var docStore = qm.store(docStoreName);
  
   var docId = parseInt(params.did);
  if(isNaN(docId)) {
    res.setStatusCode(400);
    res.send("Invalid document id:" + params.did);
    return;
  }
  var doc = docStore[docId];
  if(doc === null) {
    res.setStatusCode(404);
    res.send("document '" + docId + "' not found");
    return;
  }

  var d = documentFromRecord(doc, ontology, docsFieldName, false);
  res.send(d); 
});



/*
 * Concept
 */
/// Read - Get Al Concepts, @TODO add query parameter here
http.onRequest("ontologies/<ontology>/concepts/", "GET", function (req, res) {
  console.say("OntoGen API - Concept GET ALL");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }

  var concepts = [];
  for (var ii = 0; ii < store.length; ii++) {
    if (!store[ii].isDeleted) {
      var c = conceptFromRecord(store[ii], params.ontology);
      concepts.push(c);
    }
  }

  res.send(concepts);
  //res.send(concepts);
});

/// Concept - Read
http.onRequest("ontologies/<ontology>/concepts/<cid>/", "GET", function (req, res) {
  console.say("OntoGen API - Concept GET");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  if(!params.hasOwnProperty("cid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: concept id");
    return;
  }
  var conceptId = parseInt(params.cid);
  if(isNaN(conceptId)) {
    res.setStatusCode(400);
    res.send("Invalid concept id:" + params.cid);
    return;
  }
  var concept = store[conceptId];
  if(concept === null) {
    res.setStatusCode(404);
    res.send("concept '" + conceptId + "' not found");
    return;
  }
  var c = conceptFromRecord(concept, params.ontology);
  res.send(c); 
});

/// Concept - Create
http.onRequest("ontologies/<ontology>/concepts/", "POST", function (req, res) {
  console.say("OntoGen API - Concept POST");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  if(!req.hasOwnProperty("jsonData")) {
    res.setStatusCode(400);
    res.send("Missing data.");
    return;
  }

  // init concept object
  var concept = {};

  // concept name (required)
  var data = req.jsonData;
  if(!data.hasOwnProperty("name")) {
    res.setStatusCode(400);
    res.send("Missing concept name.");
    return;
  }
  concept.name = data.name;

  // concept parent (required)
  if(!data.hasOwnProperty("parentId")) {
    res.setStatusCode(400);
    res.send("Missing parent.");
    return;
  }
  var parentId = checkParentId(store, data.parentId, res);
  if(parentId === null) {
    return; // response has been handled
  }

  // set the join
  concept.parent = {$id: parentId};

  // keywords
  concept.keywords = data.keywords || "";

  var lopts = qm.analytics.getLanguageOptions();
  // Stopwords
  concept.stopwords = store[parentId].stopwords;
  if(data.hasOwnProperty("stopwords")) {
    if(lopts.stopwords.indexOf(data.stopwords) >= 0) {
      concept.stopwords = data.stopwords;
    }
  }

  // Stemmer
  concept.stemmer = store[parentId].stemmer;
  if(data.hasOwnProperty("stemmer")) {
    if(lopts.stemmer.indexOf(data.stemmer) >= 0) {
      concept.stemmer = data.stemmer;
    }
  }

  // docs - an array of ids from parent
  var docs = data.docs || [];
  concept[docsJoinName] = [];
  for(var ii = 0; ii < docs.length; ii++) {
    concept[docsJoinName].push({$id: docs[ii]});
  }

  concept.isDeleted = false; // we just created it after all...
  
  cid = store.add(concept);
  if(cid === null) {
    res.setStatusCode(500);
    res.send("Unable to add concept");
    return;
  }
  var addedConcept = conceptFromRecord(store[cid], params.ontology);
  console.say(JSON.stringify(addedConcept));

  res.send(addedConcept);
});

/// Concept - EDIT
http.onRequest("ontologies/<ontology>/concepts/<cid>/", "PUT", function (req, res) {
  console.say("OntoGen API - Concept edit PUT");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  if(!params.hasOwnProperty("cid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: concept id");
    return;
  }
  var conceptId = parseInt(params.cid);
  if(isNaN(conceptId)) {
    res.setStatusCode(400);
    res.send("Invalid concept id:" + params.cid);
    return;
  }
  var concept = store[conceptId];
  if(concept === null) {
    res.setStatusCode(404);
    res.send("concept '" + conceptId + "' not found");
    return;
  }
  if(!req.hasOwnProperty("jsonData")) {
    res.setStatusCode(400);
    res.send("Missing data.");
    return;
  }
  var data = req.jsonData;

  // updates a to record are made by adding a {record: $id} obbject
  // with the properties to be changed
  var change = {"$id": concept.$id};

  // name
  if(data.hasOwnProperty("name")) {
    change.name = data.name;
  }

  // keywords
  if(data.hasOwnProperty("keywords")) {
    change.keywords = data.keywords;
  }

  var lopts = qm.analytics.getLanguageOptions();
  // Stopwords
  if(data.hasOwnProperty("stopwords")) {
    if(lopts.stopwords.indexOf(data.stopwords) >= 0) {
      change.stopwords = data.stopwords;
    }
  }

  // Stemmer
  if(data.hasOwnProperty("stemmer")) {
    if(lopts.stemmer.indexOf(data.stemmer) >= 0) {
      change.stemmer = data.stemmer;
    }
  }

  var cid = store.add(change);
  if(cid === null) {
    res.setStatusCode(500);
    res.send("Unable to add concept");
    return;
  }
  concept = store[cid];

  // Check if concept is root, if not, possibly allow change of parent
  if(concept.parent !== null) {
    // Change Parent ("Move")
    if(data.hasOwnProperty("parentId")) {
      if (data.parentId !== concept.parent.$id) {
        var parentId = checkParentId(store, data.parentId, res);
        if (parentId === null) {
          res.setStatusCode(500);
          res.send("Invalid parent");
          return;
        }
        // new parent is valid
        concept.delJoin('parent', store[concept.parent.$id]);
        concept.addJoin('parent', store[parentId]);
      } // end of check if parent id is different from current parent id
    } // end of check for parent id in data
  } // end of is root check

  var addedConcept = conceptFromRecord(store[cid], params.ontology);

  res.send(addedConcept);
});


/// Concept -  GET subsconcepts
http.onRequest("ontologies/<ontology>/concepts/<cid>/subconcepts/", "GET", function (req, res) {
  console.say("OntoGen API - GET SUB CONCETPS");
  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  if(!params.hasOwnProperty("cid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: concept id");
    return;
  }
  var conceptId = parseInt(params.cid);
  if(isNaN(conceptId)) {
    res.setStatusCode(400);
    res.send("Invalid concept id:" + params.cid);
    return;
  }
  var concept = store[conceptId];
  if(concept === null) {
    res.setStatusCode(404);
    res.send("concept '" + conceptId + "' not found");
    return;
  }

  var rSet = concept[childJoinName];
  var data = [];
  for(var ii = 0; ii < rSet.length; ii++) {
    if(!rSet[ii].isDeleted) {
      data.push(conceptFromRecord(rSet[ii], params.ontology));
    }
  }

  res.send(data);
});


/// Concept - DELETE Concept (and sub-concepts)
http.onRequest("ontologies/<ontology>/concepts/<cid>/", "DELETE", function (req, res) {
  console.say("OntoGen API - Concept DELETE");
  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  if(!params.hasOwnProperty("cid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: concept id");
    return;
  }
  var conceptId = parseInt(params.cid);
  if(isNaN(conceptId)) {
    res.setStatusCode(400);
    res.send("Invalid concept id:" + params.cid);
    return;
  }
  var concept = store[conceptId];
  if(concept === null) {
    res.setStatusCode(404);
    res.send("concept '" + conceptId + "' not found");
    return;
  }

  if(concept.parentId === -1) {
    res.setStatusCode(400);
    res.send("Root concept can not be deleted");
    return;
  }

  var recursiveDelete = function(c) {
    var rSet = c[childJoinName];

    var data = [];
    for(var ii = 0; ii < rSet.length; ii++) {
      recursiveDelete(rSet[ii]);
    }
    var change = {"$id": c.$id};
    change.isDeleted = true;
    store.add(change);
  };
  recursiveDelete(concept);
  
  res.setStatusCode(204);
  res.send();
});


/// Concept - Read Docs - Get List of Document Ids
http.onRequest("ontologies/<ontology>/concepts/<cid>/docs/", "GET", function (req, res) {
  console.say("OntoGen API - Concept GET docs");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var storeName = params.ontology;
  var store = qm.store(storeName);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  if(!params.hasOwnProperty("cid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: concept id");
    return;
  }
  var conceptId = parseInt(params.cid);
  if(isNaN(conceptId)) {
    res.setStatusCode(400);
    res.send("Invalid concept id:" + params.cid);
    return;
  }
  var concept = store[conceptId];
  if(concept === null) {
    res.setStatusCode(404);
    res.send("concept '" + conceptId + "' not found");
    return;
  }
  if(concept.isDeleted) {
    res.setStatusCode(410);
    res.send("concept '" + conceptId + "' has been deleted.");
    return;
  }

  // doc ids for concept
  var rSet = concept[docsJoinName]; // concept documents
  var result;

  var args = req.args || {};

  if(args.hasOwnProperty("query")) {
    // Query
    var docIds = [];
    for (var jj = 0; jj < rSet.length; jj++) {
      docIds.push(rSet[jj].$id);
    }
    var docStoreName = docStoreNameFromOntoStore(store, storeName); // storeName = ontology
    var query = {}; query.$from = docStoreName;
    query[docsFieldName] = args.query[0];
    //console.say(JSON.stringify(query));
    // perform search
    result = qm.search(query); // search
    // filter by concept docs
    result.filterById(docIds);
  }
  else {
    // No Query
    result = rSet;
  }

  // Nothing - send empty array
  if(result.length === 0) {
    res.send([]);
    return;
  }

  var fullDocs = false; // reply with the full document object
  if(args.hasOwnProperty("full")) {
    if(args.full[0].toLowerCase() === "true") {
      fullDocs = true;
    }
  }
  
  var docs;
  if(fullDocs) {
    // Get Pagination Arguments
    var page = 0;
    if(args.hasOwnProperty('page')) {
      page = parseInt(args.page);
    }
    var per_page = 50;
    if(args.hasOwnProperty('per_page')) {
      per_page = parseInt(args.per_page);
    }
    docs = paginatedDocuments(result, storeName, docsFieldName, page,
                                per_page, false); 
  }
  else {
    docs = [];
    for(var ii = 0; ii < result.length; ii++) {
      docs.push(result[ii].$id);
    }
  }
  res.send(docs); 
});


/// Concept - EDIT Docs - Edit List of Document Ids
http.onRequest("ontologies/<ontology>/concepts/<cid>/docs/", "PATCH", function (req, res) {
  console.say("OntoGen API - Concept Edit doc list");
  console.say(JSON.stringify(req));
  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var storeName = params.ontology;
  var store = qm.store(storeName);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  if(!params.hasOwnProperty("cid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: concept id");
    return;
  }
  var conceptId = parseInt(params.cid);
  if(isNaN(conceptId)) {
    res.setStatusCode(400);
    res.send("Invalid concept id:" + params.cid);
    return;
  }
  var concept = store[conceptId];
  if(concept === null) {
    res.setStatusCode(404);
    res.send("concept '" + conceptId + "' not found");
    return;
  }
  if(concept.isDeleted) {
    res.setStatusCode(410);
    res.send("concept '" + conceptId + "' has been deleted.");
    return;
  }
  if(!req.hasOwnProperty("jsonData")) {
    res.setStatusCode(400);
    res.send("Missing data.");
    return;
  }
  var data = req.jsonData;
  if(!data.hasOwnProperty("operation")) {
    res.setStatusCode(400);
    res.send("Missing operation:add or operation:del");
    return;
  }
  var op = data.operation;
  if(op !== "add" && op !== "del") {
    res.setStatusCode(400);
    res.send("Invalid operation: " + op);
    return;
  }
  if(!data.hasOwnProperty("docId")) {
    res.setStatusCode(400);
    res.send("Missing docId in data");
    return;
  }
  var docId = data.docId;
  var docStoreName = docStoreNameFromOntoStore(store, params.ontology);
  var docStore = qm.store(docStoreName);
  var doc = docStore[docId];
  if(doc === null) {
    res.setStatusCode(404);
    res.send("document '" + docId + "' not found");
    return;
  }
  if(op === "add") {
    concept.addJoin(docsJoinName, doc);
  }
  else if(op === "del") {
    concept.delJoin(docsJoinName, doc);
  }
  else {
    res.setStatusCode(500);
    res.send("Operation not properly matched.");
    return;
  }

  var rSet = concept[docsJoinName]; // concept documents
  var docs = [];
  for(var ii = 0; ii < rSet.length; ii++) {
    docs.push(rSet[ii].$id);
    //link: url_for("documents", rSet[ii].$id, storeName)
    //docs.push(rSet[ii]);
  }
  res.send(docs); 
});


/// Concept - Suggest keywords
http.onRequest("ontologies/<ontology>/concepts/<cid>/suggestkeywords/", "GET", function (req, res) {
  console.say("OntoGen API - Concept/Search");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var storeName = params.ontology;
  var store = qm.store(storeName);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  if(!params.hasOwnProperty("cid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: concept id");
    return;
  }
  var conceptId = parseInt(params.cid);
  if(isNaN(conceptId)) {
    res.setStatusCode(400);
    res.send("Invalid concept id:" + params.cid);
    return;
  }
  var concept = store[conceptId];
  if(concept === null) {
    res.setStatusCode(404);
    res.send("concept '" + conceptId + "' not found");
    return;
  }
  if(concept.isDeleted) {
    res.setStatusCode(410);
    res.send("concept '" + conceptId + "' has been deleted.");
    return;
  }

  if(!req.hasOwnProperty("args")) {
    res.setStatusCode(400);
    res.send("Missing arguments.");
    return;
  }
  var ontology = params.ontology;
  var docStoreName = docStoreNameFromOntoStore(store, ontology);

   // docs
  var rSet = concept[docsJoinName]; // concept documents

  // Not Found - send "empty" object
  /*
   if(rSet.length === 0) {
    res.send({isEmpty: true});
    return;
  }
  */
  // Aggregate Keywords
  var numKeywords = parseInt(req.args.numKeywords) || DEFAULT_NUM_KEYWORDS;
  var get_keywords = [{name: 'keywords', type: 'keywords', field: docsFieldName}];
  var keywords = rSet.aggr(get_keywords[0]);

  // Create suggestion object
  var skeywords = keywords.keywords.map(function(k) { return k.keyword; });
  var rkey = {keywords: skeywords.slice(0, numKeywords).join(", ")};

  res.send(rkey); 
});


/// Concept - Search Based Concept Suggestion
http.onRequest("ontologies/<ontology>/concepts/<cid>/search/", "GET", function (req, res) {
  console.say("OntoGen API - Concept/Search");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var storeName = params.ontology;
  var store = qm.store(storeName);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  if(!params.hasOwnProperty("cid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: concept id");
    return;
  }
  var conceptId = parseInt(params.cid);
  if(isNaN(conceptId)) {
    res.setStatusCode(400);
    res.send("Invalid concept id:" + params.cid);
    return;
  }
  var concept = store[conceptId];
  if(concept === null) {
    res.setStatusCode(404);
    res.send("concept '" + conceptId + "' not found");
    return;
  }
  if(concept.isDeleted) {
    res.setStatusCode(410);
    res.send("concept '" + conceptId + "' has been deleted.");
    return;
  }

  if(!req.hasOwnProperty("args")) {
    res.setStatusCode(400);
    res.send("Missing arguments.");
    return;
  }
  var args = req.args;
  if(!args.hasOwnProperty("query")) {
    res.setStatusCode(400);
    res.send("Missing query argument.");
    return;
  }
  var ontology = params.ontology;
  var docStoreName = docStoreNameFromOntoStore(store, ontology);

  var query = {}; query.$from = docStoreName;
  query[docsFieldName] = args.query[0];
  console.say(JSON.stringify(query));

  // doc ids for intercept
  var rSet = concept[docsJoinName]; // concept documents
  var docIds = [];
  for (var jj = 0; jj < rSet.length; jj++) {
    docIds.push(rSet[jj].$id);
  }

  // perform search
  var result = qm.search(query); // search
  // filter by concept docs
  result.filterById(docIds);

  var docs = [];
  for(var ii = 0; ii < result.length; ii++) {
    docs.push(result[ii].$id);
    //link: url_for("documents", rSet[ii].$id, storeName)
    //docs.push(rSet[ii]);
  }
  // Not Found - send "empty" object
  if(docs.length === 0) {
    res.send({isEmpty: true});
    return;
  }
  // Aggregate Keywords
  var get_keywords = [{name: 'keywords', type: 'keywords', field: docsFieldName}];
  var keywords = result.aggr(get_keywords[0]);

  // Create suggestion object
  var suggestion = {};
  var skeywords = keywords.keywords.map(function(k) { return k.keyword; });
  suggestion.name = skeywords.slice(0,3).join(", ");
  suggestion.keywords = skeywords.slice(0, 10).join(", ");
  suggestion.parentId = conceptId;
  suggestion.docs = docs;


  res.send(suggestion); 
});


/// Concept - Suggest sub-concepts
http.onRequest("ontologies/<ontology>/concepts/<cid>/suggest/", "GET", function (req, res) {
  console.say("OntoGen API - Concept GET suggestions");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  var storeName = params.ontology;

  if(!params.hasOwnProperty("cid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: concept id");
    return;
  }
  var conceptId = parseInt(params.cid);
  if(isNaN(conceptId)) {
    res.setStatusCode(400);
    res.send("Invalid concept id:" + params.cid);
    return;
  }
  var concept = store[conceptId];
  if(concept === null) {
    res.setStatusCode(404);
    res.send("concept '" + conceptId + "' not found");
    return;
  }
  if(concept.isDeleted) {
    res.setStatusCode(410);
    res.send("concept '" + conceptId + "' has been deleted.");
    return;
  }

  var lopts = qm.analytics.getLanguageOptions();
  // Stopwords
  var stopwords = concept.stopwords;
  if(req.args.hasOwnProperty("stopwords")) {
    if(lopts.stopwords.indexOf(req.args.stopwords) >= 0) {
      stopwords = req.args.stopwords;
    }
  }

  // Stemmer
  var stemmer = concept.stemmer;
  if(req.args.hasOwnProperty("stemmer")) {
    if(lopts.stemmer.indexOf(req.args.stemmer) >= 0) {
      stemmer = req.args.stemmer;
    }
  }

  var numSuggest = parseInt(req.args.numSuggest) || DEFAULT_SUGGESTIONS;
  var numIter = parseInt(req.args.numIter) || DEFAULT_ITER;
  var numKeywords = parseInt(req.args.numKeywords) || DEFAULT_NUM_KEYWORDS;

  // Create Feature Space
  var docStoreName = docStoreNameFromOntoStore(store, params.ontology);
  var docStore = qm.store(docStoreName);
  var conceptDocs = concept[docsJoinName];
  var ftrSpace = qm.analytics.newFeatureSpace([{type: 'text',
                                                source: docStoreName,
                                                field: docsFieldName,
                                                stemmer: {type: stemmer},
                                                stopwords: stopwords}]);
  ftrSpace.updateRecords(conceptDocs);
  ftrSpace.finishUpdate();
  
  // Perform KMeans
  var KMeansParams = {k: numSuggest, maxIterations: numIter, randomSeed:1};
  var clusters = qm.analytics.trainKMeans(ftrSpace, conceptDocs , KMeansParams);

  // Get Words
  var get_keywords = [{name: 'keywords', type: 'keywords', field: docsFieldName}];
  suggestions = [];

  for(var ii = 0; ii < clusters.length; ii++) {
    var keywords = clusters[ii].aggr(get_keywords[0]);
    var docids = [];
    for(var jj = 0; jj < clusters[ii].length; jj++) {
      docids.push(clusters[ii][jj].$id);
    }
    suggestions.push({keywords: keywords, docs: docids});
  }
  suggestions = suggestions.map(function(s) {
    var suggestion = {};
    var skeywords = s.keywords.keywords.map(function(k) { return k.keyword; });
    suggestion.name = skeywords.slice(0,3).join(", ");
    suggestion.keywords = skeywords.slice(0, 10).join(", ");
    suggestion.parentId = conceptId;
    suggestion.docs = s.docs;
    return suggestion;
  });
  res.send(suggestions); 
});

/*
 * Active Learning
 */
/// AL - Create
http.onRequest("ontologies/<ontology>/concepts/<cid>/al/", "POST", function (req, res) {
  console.say("OntoGen API - AL Create - POST");
  
  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  var storeName = params.ontology;

  if(!params.hasOwnProperty("cid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: concept id");
    return;
  }
  var conceptId = parseInt(params.cid);
  if(isNaN(conceptId)) {
    res.setStatusCode(400);
    res.send("Invalid concept id:" + params.cid);
    return;
  }
  var concept = store[conceptId];
  if(concept === null) {
    res.setStatusCode(404);
    res.send("concept '" + conceptId + "' not found");
    return;
  }
  if(concept.isDeleted) {
    res.setStatusCode(410);
    res.send("concept '" + conceptId + "' has been deleted.");
    return;
  }

  if(!req.hasOwnProperty("jsonData")) { 
    res.setStatusCode(400);
    res.send("Missing data");
    return;
  } 
  var data = req.jsonData;

  if(!data.hasOwnProperty("query")) {
    res.setStatusCode(400);
    res.send("Missing data: query");
    return;
  }
  var query = data.query;

  var lopts = qm.analytics.getLanguageOptions();
  // Stopwords
  var stopwords = concept.stopwords;
  if(data.hasOwnProperty("stopwords")) {
    if(lopts.stopwords.indexOf(data.stopwords) >= 0) {
      stopwords = data.stopwords;
    }
  }

  // Stemmer
  var stemmer = concept.stemmer;
  if(data.hasOwnProperty("stemmer")) {
    if(lopts.stemmer.indexOf(data.stemmer) >= 0) {
      stemmer = data.stemmer;
    }
  }

  var name = query.split(" ").join("_") + "_" + randomPosInt32();
  if(data.hasOwnProperty("name")) {
    // extremely restrictive use of names
    name = String(data.name);
    if(name.match(/^[0-9a-zA-Z_]+$/) === null) {
      res.setStatusCode(400);
      res.send("Active learner name must be alphanumeric (underscore allowed).");
      return;
    }
    name = data.name;
  }

  // Create Feature Space
  var docStoreName = docStoreNameFromOntoStore(store, storeName);
  var docStore = qm.store(docStoreName);
  var conceptDocs = concept[docsJoinName];
  var ftrSpace = qm.analytics.newFeatureSpace([{type: 'text',
                                                source: docStoreName,
                                                field: docsFieldName,
                                                stemmer: {type: stemmer},
                                                stopwords: stopwords}]);
  ftrSpace.updateRecords(conceptDocs);
  ftrSpace.finishUpdate();

  // Transform Query
  var queryObj = {}; queryObj[docsFieldName] = query;
  var transformedQuery = ftrSpace.extractStrings(queryObj)[0];

  var AL = qm.analytics.newActiveLearner(ftrSpace, conceptDocs, {name: name, query: transformedQuery});

  if(AL === null) {
    res.setStatusCode(500);
    res.send("Unable to create active learner");
    return;
  }

  // Get new question
  var qid = 0;
  var question = AL.getQuestion(qid);
  question.id = name; // this uses the AL id (no client side question obj)
  question.qid = qid;
  question.links = {};
  question.links.self = url_for("al", name, storeName, conceptId);

  // Document associated with Question
  var dId = parseInt(question.questionId);
  var doc = conceptDocs[dId];
  question.text = doc[docsFieldName];

  res.setStatusCode(201);
  res.send(question);

});

/// AL - Get Question
http.onRequest("ontologies/<ontology>/concepts/<cid>/al/<alid>/", "GET", function (req, res) {
  console.say("OntoGen API - AL/name/ GET");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  var storeName = params.ontology;

  if(!params.hasOwnProperty("cid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: concept id");
    return;
  }
  var conceptId = parseInt(params.cid);
  if(isNaN(conceptId)) {
    res.setStatusCode(400);
    res.send("Invalid concept id:" + params.cid);
    return;
  }
  var concept = store[conceptId];
  if(concept === null) {
    res.setStatusCode(404);
    res.send("concept '" + conceptId + "' not found");
    return;
  }
  if(concept.isDeleted) {
    res.setStatusCode(410);
    res.send("concept '" + conceptId + "' has been deleted.");
    return;
  }

  if(!params.hasOwnProperty("alid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: active learner id (name)");
    return;
  }
  var name = params.alid;

  var qid = 0;
  if(req.args.hasOwnProperty("qid")) {
    qid = parseInt(req.args.qid[0]);
  }

  // Load AL
  var AL = qm.analytics.newActiveLearner(name);
  if(AL === null) {
    res.setStatusCode(404);
    res.send("Active Learner Not Found");
    return;
  }

  var question = AL.getQuestion(qid);
  question.id = name; // this uses the AL id (no client side question obj)
  question.qid = qid;
  question.links = {};
  question.links.self = url_for("al", name, storeName, conceptId);

  // Document associated with Question
  var dId = parseInt(question.questionId);
  var docStoreName = docStoreNameFromOntoStore(store, storeName);
  var docStore = qm.store(docStoreName);
  var conceptDocs = concept[docsJoinName];
  var doc = conceptDocs[dId];
  
  var keywords = question.keywords.split(", ");
  // get keywords if return mode = true
  if(question.mode) {
    var positives = AL.getPositives();
    console.say(JSON.stringify(positives));
    positiveDocs = [];
    for (var ii = 0; ii < positives.length; ii++) {
      positiveDocs.push(conceptDocs[positives[ii]].$id);
    }
    var get_keywords = [{name: 'keywords', type: 'keywords', field: docsFieldName}];

    if (positiveDocs.length > 0) {
      var posRecs = conceptDocs;
      posRecs.filterById(positiveDocs);
      keywords = posRecs.aggr(get_keywords[0]);
      keywords = keywords.keywords.map(function(k) { return k.keyword; });
    }
  }

  question.text = doc[docsFieldName];
  question.name = keywords.slice(0,3).join(", ").toUpperCase();
  question.keywords = keywords.slice(0, 10).join(", ").toUpperCase();


  res.send(question);

});

/// AL - Answer Question
http.onRequest("ontologies/<ontology>/concepts/<cid>/al/<alid>/", "PATCH", function (req, res) {
  console.say("OntoGen API - AL/name/ PATCH");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  var storeName = params.ontology;

  if(!params.hasOwnProperty("cid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: concept id");
    return;
  }
  var conceptId = parseInt(params.cid);
  if(isNaN(conceptId)) {
    res.setStatusCode(400);
    res.send("Invalid concept id:" + params.cid);
    return;
  }
  var concept = store[conceptId];
  if(concept === null) {
    res.setStatusCode(404);
    res.send("concept '" + conceptId + "' not found");
    return;
  }
  if(concept.isDeleted) {
    res.setStatusCode(410);
    res.send("concept '" + conceptId + "' has been deleted.");
    return;
  }

  if(!params.hasOwnProperty("alid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: active learner id (name)");
    return;
  }
  var name = params.alid;

  if(!req.hasOwnProperty("jsonData")) {
    res.setStatusCode(400);
    res.send("Missing data.");
    return;
  }
  var data = req.jsonData;

  if(!data.hasOwnProperty("answer")) {
    res.setStatusCode(400);
    res.send("Missing answer");
    return;
  }
  if(!data.hasOwnProperty("questionId")) {
    res.setStatusCode(400);
    res.send("Missing question id");
    return;
  }

  var qid = 0;
  if(req.args.hasOwnProperty("qid")) {
    qid = parseInt(req.args.qid[0]);
  }

  var pos = data.answer;
  var did = data.questionId;

  // Load AL
  var AL = qm.analytics.newActiveLearner(name);
  if(AL === null) {
    res.setStatusCode(404);
    res.send("Active Learner Not Found");
    return;
  }

  // Answer Question
  AL.answerQuestion(did, pos);

  // Get New Question
  qid = 0; // new qid value
  var question = AL.getQuestion(qid);
  question.id = name; // this uses the AL id (no client side question obj)
  question.qid = qid;
  question.links = {};
  question.links.self = url_for("al", name, storeName, conceptId);
  
  // Document associated with Question
  var dId = parseInt(question.questionId);
  var docStoreName = docStoreNameFromOntoStore(store, storeName);
  var docStore = qm.store(docStoreName);
  var conceptDocs = concept[docsJoinName];
  var doc = conceptDocs[dId];

  var keywords = question.keywords.split(", ");
  // get keywords if return mode = true
  if(question.mode) {
    var positives = AL.getPositives();
    positiveDocs = [];
    for (var ii = 0; ii < positives.length; ii++) {
      positiveDocs.push(conceptDocs[positives[ii]].$id);
    }
    var get_keywords = [{name: 'keywords', type: 'keywords', field: docsFieldName}];

    if (positiveDocs.length > 0) {
      var posRecs = conceptDocs;
      posRecs.filterById(positiveDocs);
      keywords = posRecs.aggr(get_keywords[0]);
      keywords = keywords.keywords.map(function(k) { return k.keyword; });
    }
  }

  question.text = doc[docsFieldName];
  question.name = keywords.slice(0,3).join(", ").toUpperCase();
  question.keywords = keywords.slice(0, 10).join(", ").toUpperCase();

  res.send(question);
});

/// AL - Cancel
http.onRequest("ontologies/<ontology>/concepts/<cid>/al/<alid>/", "DELETE", function (req, res) {
  console.say("OntoGen API - AL/name/ DELETE");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  var storeName = params.ontology;

  if(!params.hasOwnProperty("cid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: concept id");
    return;
  }
  var conceptId = parseInt(params.cid);
  if(isNaN(conceptId)) {
    res.setStatusCode(400);
    res.send("Invalid concept id:" + params.cid);
    return;
  }
  var concept = store[conceptId];
  if(concept === null) {
    res.setStatusCode(404);
    res.send("concept '" + conceptId + "' not found");
    return;
  }
  if(concept.isDeleted) {
    res.setStatusCode(410);
    res.send("concept '" + conceptId + "' has been deleted.");
    return;
  }

  if(!params.hasOwnProperty("alid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: active learner id (name)");
    return;
  }
  var name = params.alid;

  qm.analytics.delActiveLearner(name);
  res.setStatusCode(204);
  res.send();
});

/// AL - Get Concept
http.onRequest("ontologies/<ontology>/concepts/<cid>/al/<alid>/", "POST", function (req, res) {
  console.say("OntoGen API - AL/name/ POST");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  var storeName = params.ontology;

  if(!params.hasOwnProperty("cid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: concept id");
    return;
  }
  var conceptId = parseInt(params.cid);
  if(isNaN(conceptId)) {
    res.setStatusCode(400);
    res.send("Invalid concept id:" + params.cid);
    return;
  }
  var concept = store[conceptId];
  if(concept === null) {
    res.setStatusCode(404);
    res.send("concept '" + conceptId + "' not found");
    return;
  }
  if(concept.isDeleted) {
    res.setStatusCode(410);
    res.send("concept '" + conceptId + "' has been deleted.");
    return;
  }

  if(!params.hasOwnProperty("alid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: active learner id (name)");
    return;
  }
  var name = params.alid;
  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }

  // Load AL
  var AL = qm.analytics.newActiveLearner(name);
  if(AL === null) {
    res.setStatusCode(404);
    res.send("Active Learner Not Found");
    return;
  }

  // Build concept from positive records
  var positives = AL.getPositives();

  // Associated documents
  var docStoreName = docStoreNameFromOntoStore(store, storeName);
  var docStore = qm.store(docStoreName);
  var conceptDocs = concept[docsJoinName];

  // Create Suggestion Object
  var suggestion = {};
  suggestion.docs = [];
  for (var ii = 0; ii < positives.length; ii++) {
    suggestion.docs.push(conceptDocs[positives[ii]].$id);
  }

  var get_keywords = [{name: 'keywords', type: 'keywords', field: docsFieldName}];
  var keywords;

  if (suggestion.docs.length > 0) {
    var posRecs = conceptDocs;
    posRecs.filterById(suggestion.docs);
    keywords = posRecs.aggr(get_keywords[0]);
    keywords = keywords.keywords.map(function(k) { return k.keyword; });
  }
  else {
    // This should not happen: get Words from AL
    keywords = AL.getQuestion(0).keywords.split(", ");
  }
  suggestion.name = keywords.slice(0,3).join(", ").toUpperCase();
  suggestion.keywords = keywords.slice(0, 10).join(", ").toUpperCase();
  suggestion.parentId = conceptId;
  
  res.send(suggestion);

});

/*
 * Classifiers
 */
/// Classifier for Concept - Create
http.onRequest("ontologies/<ontology>/classifiers/", "POST", function (req, res) {
  console.say("OntoGen API - Concept Classifier - POST");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  // ontology
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  var ontology = params.ontology;
  // request data
  if(!req.hasOwnProperty("jsonData")) {
    res.setStatusCode(400);
    res.send("Missing data.");
    return;
  }
  var data = req.jsonData;

  // concept
  if(!data.hasOwnProperty("cid")) { 
    res.setStatusCode(400);
    res.send("Missing concept id (cid).");
    return;
  }
  var conceptId = parseInt(data.cid);
  if(isNaN(conceptId)) {
    res.setStatusCode(400);
    res.send("Invalid concept id:" + params.cid);
    return;
  }
  var concept = store[conceptId];
  if(concept === null) {
    res.setStatusCode(404);
    res.send("concept '" + conceptId + "' not found");
    return;
  }
  if(concept.isDeleted) {
    res.setStatusCode(410);
    res.send("concept '" + conceptId + "' has been deleted.");
    return;
  }

  // get the classifier name
  if(!data.hasOwnProperty("name")) {
    res.setStatusCode(400);
    res.send("Missing classifier name.");
    return;
  }
  // used as part of the URL so make it "safe") - extremely restrictive names
  var name = String(data.name);
  if(!name.match(/^[0-9a-zA-Z_]+$/)) {
    res.setStatusCode(400);
    res.send("Classifier name must be alphanumeric (underscore allowed).");
    return;
  }

  var lopts = qm.analytics.getLanguageOptions();

  // Stopwords
  var stopwords = concept.stopwords;
  if(data.hasOwnProperty("stopwords")) {
    if(lopts.stopwords.indexOf(data.stopwords) >= 0) {
      stopwords = data.stopwords;
    }
  }

  // Stemmer
  var stemmer = concept.stemmer;
  if(data.hasOwnProperty("stemmer")) {
    if(lopts.stemmer.indexOf(data.stemmer) >= 0) {
      stemmer = data.stemmer;
    }
  }

  // get the concept documents (Pos ex)
  var posRecs = concept[docsJoinName];
  if(posRecs.length < 1) {
    res.setStatusCode(400);
    res.send("No positve examples found (i.e. no documents in concept).");
    return;
  }
  // get all documents NOT in concept (Neg ex)
  var docStoreName = docStoreNameFromOntoStore(store, ontology);
  var docStore = qm.store(docStoreName);
  var negRecs = docStore.recs;
  negRecs.filterExcludeRecs(posRecs);
  if(negRecs.length < 1) {
    res.setStatusCode(400);
    res.send("No negative examples found (i.e. all documents are in concept).");
    return;
  }

  // get svm c parameter, default is 1.0
  var c = 1.0;
  if(data.hasOwnProperty("c")) {
    if(!isNaN(data.c) && data.c > 0.0) {
      c = data.c;
    }
  } 
  // get the svm j parameter, default is balanced
  var j = negRecs.length / posRecs.length;
  if(data.hasOwnProperty("j")) {
    if(!isNaN(data.j) && data.j > 0.0) {
      j = data.j;
    }
  }
  // SvmParam
  var SvmParam = {C:c, j:j, normalize:false};

  // feature space
  var ftrSpace = qm.analytics.newFeatureSpace([{type: 'text',
                                                source: docStoreName,
                                                field: docsFieldName,
                                                stemmer: {type: stemmer},
                                                stopwords: stopwords}]);
  ftrSpace.updateRecords(docStore.recs); // neg + pos recs = all
  ftrSpace.finishUpdate();

  // build and store classifier
  var cls = qm.analytics.trainSvmClassify(ftrSpace, posRecs, negRecs, SvmParam, name);

  if(typeof(cls) === "undefined" || cls === null) {
    res.setStatusCode(500);
    res.send("Unable to build this classifer.");
    return;
  }

  // return url for classifier
  var msg = classifierFromName(name, ontology);
  res.setStatusCode(201);
  res.send(msg);
});

/// List existing classifiers (models)
http.onRequest("ontologies/<ontology>/classifiers/", "GET", function (req, res) {
  console.say("OntoGen API - Classifiers  Get");
  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  // ontology
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var ontology = params.ontology;
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }

  // list only classifiers that begin with this ontology's name
  var list = qm.analytics.listSvm().filter(function(name) {
    return name.indexOf(ontology + "_") === 0;
  });
  // build classifier JSON representation
  var classifiers = list.map(function(name) {
    return classifierFromName(name, ontology);
  });
  res.send(classifiers);
});

/// Classify array of documents
http.onRequest("ontologies/<ontology>/classifiers/<mid>/", "POST", function (req, res) {
  console.say("OntoGen API - Classify with model POST");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  // ontology
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  // classifier
  if(!params.hasOwnProperty("mid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: model id (classifier name).");
    return;
  }
  var mid = params.mid;
  var svm = qm.analytics.loadSvm(mid);
  if(svm === null) {
    res.setStatusCode(404);
    res.send("Model (classifier) not found: " + mid + ".");
    return;
  }
  if(!req.hasOwnProperty("jsonData")) {
    res.setStatusCode(200);
    res.send([]);
    return;
  }
  var data = req.jsonData; // data should be an array of records in JSON format
  var docStoreName = docStoreNameFromOntoStore(store, params.ontology);
  var docStore = qm.store(docStoreName);
  
  // classify loop
  var results = [];
  for(var ii = 0; ii < data.length; ii++) {
    var rec = docStore.newRec(data[ii]);
    var r = svm.classify(rec);
    results.push(r);
  }
  res.send(results);
});

/// Classify array of documents
http.onRequest("ontologies/<ontology>/classifiers/<mid>/", "DELETE", function (req, res) {
  console.say("OntoGen API - DELETE Classifier");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  // ontology
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  // classifier
  if(!params.hasOwnProperty("mid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: model id (classifier name).");
    return;
  }
  var mid = params.mid;
  qm.analytics.delSvm(mid);
  res.send();
});


/// Concept -  GET subsconcepts from classifier
http.onRequest("ontologies/<ontology>/concepts/<cid>/classify/<mid>/", "GET", function (req, res) {
  console.say("OntoGen API - GET SUB CONCETPS FROM CLASSIFIER");
  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: ontology name");
    return;
  }
  var store = qm.store(params.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + params.ontology + "' not found");
    return;
  }
  var ontology = params.ontology;
  if(!params.hasOwnProperty("cid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: concept id");
    return;
  }
  var conceptId = parseInt(params.cid);
  if(isNaN(conceptId)) {
    res.setStatusCode(400);
    res.send("Invalid concept id:" + params.cid);
    return;
  }
  var concept = store[conceptId];
  if(concept === null) {
    res.setStatusCode(404);
    res.send("concept '" + conceptId + "' not found");
    return;
  }
  // classifier
  if(!params.hasOwnProperty("mid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: model id (classifier name).");
    return;
  }
  var mid = params.mid;
  var svm = qm.analytics.loadSvm(mid);
  if(svm === null) {
    res.setStatusCode(404);
    res.send("Model (classifier) not found: " + mid + ".");
    return;
  }


  // Threshold?
  var threshold = parseFloat(req.args.thresh) || 0;

  // Get documents for concept
  var docStoreName = docStoreNameFromOntoStore(store, ontology);
  var docStore = qm.store(docStoreName);
  var conceptDocs = concept[docsJoinName];

  // Classify documents
  var posResults = [];
  var negResults = [];
  for(var ii = 0; ii < conceptDocs.length; ii++) {
    var rec = conceptDocs[ii];
    var r = svm.classify(rec);
    if(r > threshold) {
      posResults.push(rec.$id);
    }
    else {
      negResults.push(rec.$id);
    }
  }

  var get_keywords = [{name: 'keywords', type: 'keywords', field: docsFieldName}];
  var keywords;
  var suggestions = [];

  if (posResults.length > 0) {
    // Get keywords for positive concept
    conceptDocs = concept[docsJoinName];
    var posRecs = conceptDocs;
    posRecs.filterById(posResults);
    keywords = posRecs.aggr(get_keywords[0]);
    // Prepare positive concept
    var posConcept = {docs: posResults};
    posConcept.keywords = keywords.keywords.map(function(k) { return k.keyword; });
    posConcept.name = posConcept.keywords.slice(0,3).join(", ");
    posConcept.keywords = posConcept.keywords.slice(0, 10).join(", ");
    posConcept.parentId = conceptId;
    posConcept.positive = true;
    suggestions.push(posConcept);
  }
  if (negResults.length > 0) {
    // Get keywords for negative concept
    conceptDocs = concept[docsJoinName];
    var negRecs = conceptDocs;
    negRecs.filterById(negResults);
    keywords = negRecs.aggr(get_keywords[0]);
    // Prepare negative concept
    var negConcept = {docs: negResults};
    negConcept.keywords = keywords.keywords.map(function(k) { return k.keyword; });
    negConcept.name = negConcept.keywords.slice(0,3).join(", ");
    negConcept.keywords = negConcept.keywords.slice(0, 10).join(", ");
    negConcept.parentId = conceptId;
    negConcept.negative = true;
    suggestions.push(negConcept);
  }

  // return both positive and negative concept
  res.send(suggestions); 

});

/// List existing classifiers (models) for ALL ontologies
http.onRequest("classifiers/", "GET", function (req, res) {
  console.say("OntoGen API - Classifiers  Get ALL");
  // get list of existing ontologies
  var ontologies = listOntologies();
  ontologies = ontologies.map(function(onto) { return onto.storeName; });

  var classifiers = qm.analytics.listSvm();

  var clobjs = classifiers.map(function(name) {
    console.say("name: " + name);
    for(var ii = 0; ii < ontologies.length; ii++) {
      var ontology = ontologies[ii];
      if(name.indexOf(ontology + "_") === 0) {
        return classifierFromName(name, ontology);
      }
    }
  });
  res.send(clobjs);
});
