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
  }

  return url;

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

// Get Store info @TODO

/*
 * Ontologies
 */
// Get List of Existing Ontologies
http.onRequest("ontologies", "GET", function(req, res) {
  console.say("OntoGen API - GET Existing Ontologies");
  var ontologies = qm.getStoreList().filter(function(store) {
    return store.storeName.indexOf(ontoPrefix) === 0;
  });
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
  
  // Get the documents
  var docs = [];
  // calculate start
  var start = page * per_page;
  // calculate end
  var end = page * per_page + per_page;
  if(end > docStore.length)
    end = docStore.length;
  for (var ii = start; ii < end; ii++) {
    var d = documentFromRecord(docStore[ii], ontology, docsFieldName, true);
    docs.push(d);
  }

  res.send(docs);
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

  // Stopwords
  concept.stopwords = data.stopwords || store[parentId].stopwords;

  // Stemmer
  concept.stemmer = data.stemmer || store[parentId].stemmer;

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

  // Stopwords
  if(data.hasOwnProperty("stopwords")) {
    change.stopwords = data.stopwords;
  }

  // Stemmer
  if(data.hasOwnProperty("stemmer")) {
    change.stemmer = data.stemmer;
  }

  var cid = store.add(change);
  if(cid === null) {
    res.setStatusCode(500);
    res.send("Unable to add concept");
    return;
  }
  concept = store[cid];

  // Check if concept is root, if not, possibly allow change of parent
  if(concept.parent.$id != -1) {
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

  console.say("get rest version");
  var addedConcept = conceptFromRecord(store[cid], params.ontology);

  res.send(addedConcept);
});


/// Concept -  GET subsconcepts
http.onRequest("ontologies/<ontology>/concepts/<cid>/subconcepts", "GET", function (req, res) {
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
http.onRequest("ontologies/<ontology>/concepts/<cid>", "DELETE", function (req, res) {
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
  var rSet = concept[docsJoinName];
  var docs = [];
  for(var ii = 0; ii < rSet.length; ii++) {
    docs.push(rSet[ii].$id);
    //link: url_for("documents", rSet[ii].$id, storeName)
    //docs.push(rSet[ii]);
  }
  res.send(docs); 
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

  var numSuggest = parseInt(req.args.numSuggest) || DEFAULT_SUGGESTIONS;
  var numIter = parseInt(req.args.numIter) || DEFAULT_ITER;
  var numKeywords = parseInt(req.args.numKeywords) || DEFAULT_NUM_KEYWORDS;
  var stemmer = req.args.stemmer || concept.stemmer;
  var stopwords = req.args.stopwords || concept.stopwords;

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

  var stemmer = concept.stemmer;
  if(data.hasOwnProperty("stemmer")) {
    stemmer = data.stemmer;
  }
  var stopwords = concept.stopwords;
  if(data.hasOwnProperty("stopwords")) {
    stemmer = data.stopwords;
  }

  var name = "default";
  if(data.hasOwnProperty("name")) {
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
  question.name = question.keywords.split(", ").splice(0,3).join(", ").toUpperCase();
  question.keywords = question.keywords.split(", ").slice(0, 10).join(", ").toUpperCase();

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
  
  question.text = doc[docsFieldName];
  question.name = question.keywords.split(", ").splice(0,3).join(", ").toUpperCase();
  question.keywords = question.keywords.split(", ").slice(0, 10).join(", ").toUpperCase();

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
  
  question.text = doc[docsFieldName];
  question.name = question.keywords.split(", ").splice(0,3).join(", ").toUpperCase();
  question.keywords = question.keywords.split(", ").slice(0, 10).join(", ").toUpperCase();

  
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
  /* Non Working Alternative */
  var records = docStore.recs.filterById(suggestion.docs);
  var get_keywords = [{name: 'keywords', type: 'keywords', field: docsFieldName}];
  var keywords = records.aggr(get_keywords[0]);
  
  // Get Words
  //var keywords = AL.getQuestion(0).keywords;
  suggestion.name = keywords.split(", ").splice(0,3).join(", ").toUpperCase();
  suggestion.keywords = keywords.split(", ").slice(0, 10).join(", ").toUpperCase();
  suggestion.parentId = conceptId;
  
  res.send(suggestion);

});
