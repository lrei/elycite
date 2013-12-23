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

// @TODO replace this with an automatic function
var url_for = function(what, which, where) {
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

    case "al":
      url += "al/" + which;
      break;
  }

  return url;

};

var ontologyNameFromStoreName = function(storeName) {
  return storeName.replace(ontoRegex, "");
};

var conceptFromRecord = function(rec, ontology) {
  var c = rec;
  c.ontology = ontology;
  c.links = {};
  c.links.self = url_for("concepts", c.$id, ontology);
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
    docs.push({$record: docStore[ii].$id});
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
    res.send("Invalid parent id:" + param.parentId);
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
  
  res.send(ontogen.getLanguageOptions());
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
  concept.parent = {$record: parentId};

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
    concept[docsJoinName].push({$record: docs[ii]});
  }

  concept.isDeleted = false; // we just created it after all...
  
  cid = store.add(concept);
  if(cid === null) {
    res.setStatusCode(500);
    res.send("Unable to add concept");
    return;
  }
  var addedConcept = store[cid];

  res.send(addedConcept);
});

/// Concept - EDIT
http.onRequest("ontologies/<ontology>/concepts/<cid>", "PUT", function (req, res) {
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
  var change = {"$record": concept.$id};

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

  // Change Parent ("Move")
  if(data.hasOwnProperty("parentId")) {
    var parentId = checkParentId(store, data.parentId, res);
    if (parentId === null) {
      return;
    }
    if (parentId !== concept.parentId) {
      change.parent = {$record: parentId}; // this does not do anything
      change.parentId = parentId; // warning: hope this is not breaking the join
    }
  }

  cid = store.add(change);

  if(cid === null) {
    res.setStatusCode(500);
    res.send("Unable to add concept");
    return;
  }
  var addedConcept = store[cid];

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

  var rSet = concept.join(childJoinName);
  var data = [];
  for(var ii = 0; ii < rSet.length; ii++) {
    if(!rSet[ii].isDeleted) {
      data.push(rSet[ii]);
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

  var recursiveDelete = function(c) {
    var rSet = c.join(childJoinName);

    var data = [];
    for(var ii = 0; ii < rSet.length; ii++) {
      recursiveDelete(rSet[ii]);
    }
    var change = {"$record": c.$id};
    change.isDeleted = true;
    store.add(change);
  };
  recursiveDelete(concept);
  
  res.setStatusCode(204);
  res.send();
});


/// Concept - Read Docs
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
  if(concept.isDeleted) {
    res.setStatusCode(410);
    res.send("concept '" + conceptId + "' has been deleted.");
    return;
  }

  var rSet = concept.join(docsJoinName);
  var docs = [];
  for(var ii = 0; ii < rSet.length; ii++) {
    docs.push(rSet[ii]);
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



  var suggested = ontogen.suggestConcepts(storeName, docsJoinName, docsFieldName,
                                          stemmer, stopwords, conceptId,
                                          numSuggest, numIter, numKeywords);
  
  res.send(suggested); 
});

/*
 * Active Learning
 */
/// AL - Create
http.onRequest("al/", "POST", function (req, res) {
  console.say("OntoGen API - AL Create - GET");
  
  if(!req.hasOwnProperty("jsonData")) { 
    res.setStatusCode(400);
    res.send("Missing data");
    return;
  } 
  var data = req.jsonData;
  if(!data.hasOwnProperty("ontology")) { 
    res.setStatusCode(400);
    res.send("Missing data: ontology - ontology name");
    return;
  }
  var store = qm.store(data.ontology);
  if(store === null) {
    res.setStatusCode(404);
    res.send("Ontology '" + data.ontology + "' not found");
    return;
  }
  var storeName = data.ontology;

  if(!data.hasOwnProperty("parentId")) { 
    res.setStatusCode(400);
    res.send("Missing data: parentId - parent concept id");
    return;
  }
  var conceptId = parseInt(data.parentId);
  if(isNaN(conceptId)) {
    res.setStatusCode(400);
    res.send("Invalid concept id:" + data.parentId);
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

  var alid = randomPosInt32();
  console.say("input alid: " + alid + "(" + typeof alid +")");
  alid = ontogen.createAL(storeName, docsJoinName, docsFieldName, stemmer,
                          stopwords, conceptId, query, alid);
  if(alid < 1) {
    // TODO: handle errors
  
    res.setStatusCode(500);
    res.send();
    return;
  }
  //var al = {id: alid, parentConcept: conceptId, links: {}};
  var qid = 0;
  var question = ontogen.getQuestionFromAL(alid, qid);
  question.id = alid; // this uses the AL id (no client side question obj)

  // TODO: add links

  res.send(question);
  
});

/// AL - Get Question
http.onRequest("al/<alid>/", "GET", function (req, res) {
  console.say("OntoGen API - AL POST");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  if(!params.hasOwnProperty("alid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: active learner id (alid)");
    return;
  }
  var alid = parseInt(params.alid);
  if(isNaN(alid)) {
    res.setStatusCode(400);
    res.send("Invalid AL id:" + params.cid);
    return;
  }
  var qid = 0;
  if(req.args.hasOwnProperty("qid")) {
    qid = parseInt(req.args.qid[0]);
  }
  var question = ontogen.getQuestionFromAL(alid, qid);
  question.id = alid; // this uses the AL id (no client side question obj)

  question.links = {};
  question.links.self = url_for("al", alid);
  question.links.ontology = url_for("ontologies", question.ontology);
  if(question.mode) {
    question.links.concept = question.links.self + "/concept";
  }

  res.send(question);

});

/// AL - Answer Question
http.onRequest("al/<alid>/", "PATCH", function (req, res) {
  console.say("OntoGen API - AL PATCH");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;
  
  if(!params.hasOwnProperty("alid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: active learner id (alid)");
    return;
  }
  var alid = parseInt(params.alid);

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
  var pos = data.answer;
  var did = data.questionId;

  var ret =  ontogen.answerQuestionForAL(alid, did, pos);
  // @TODO: error handling
  var question = ontogen.getQuestionFromAL(alid, 0);
  question.id = alid; // this used the AL id

  question.links = {};
  question.links.self = url_for("al", alid);
  question.links.ontology = url_for("ontologies", question.ontology);
  if(question.mode) {
    question.links.concept = question.links.self + "/concept";
  }

  res.send(question);
});

/// AL - Cancel
http.onRequest("al/<alid>/", "DELETE", function (req, res) {
  console.say("OntoGen API - AL DELETE");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;

  if(!params.hasOwnProperty("alid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: active learner id (alid)");
    return;
  }
  var alid = parseInt(params.alid);

  ontogen.deleteAL(alid);
  res.setStatusCode(204);
  res.send();
});

/// AL - Get Concept
http.onRequest("al/<alid>/concept/", "GET", function (req, res) {
  console.say("OntoGen API - AL <id> / concept GET");

  if(!req.hasOwnProperty("params")) {
    res.setStatusCode(400);
    res.send("Missing parameters");
    return;
  }
  var params = req.params;

  if(!params.hasOwnProperty("alid")) { 
    res.setStatusCode(400);
    res.send("Missing parameter: active learner id (alid)");
    return;
  }
  var alid = parseInt(params.alid);
  var concept = ontogen.getConceptFromAL(alid);

  res.send(concept);

});
