// Ontogen - Routing - Main Module

// (c) 2013-2014 Luis Rei, Josef Stefan Institute
// MIT License

var analytics = require('analytics.js');
var restf = require('restf.js');
var stores = require('stores.js');
var documents = require('documents.js');
var concepts = require('concepts.js');
var al = require('activelearning.js');
var cls = require('classifiers.js');


// Notes
// ------
// * Trailing slashes are important! .../documents/ not ../documents
// * Generally, all document representations include a links property 
// containing at least a links.self
 
// Get Language Options
// Returns:
//  { stemmer: ["none", "porter"], stopwords: ["none", "en8", ...] }
http.onRequest("languageoptions", "GET", function(req, res) {
  console.say("OntoGen API - Language Options");

  var LangOpts = analytics.getLanguageOptions();
  res.send(LangOpts);
});

// Stores
// ------

// Get List of Data Stores
// Returns:
//
http.onRequest("stores", "GET", function(req, res) {
  console.say("OntoGen API - GET Stores");
  stores.listStores(res);
});

// Create store
http.onRequest("stores/", "POST", function(req, res) {
  console.say("OntoGen API - POST Stores");
  var data = restf.requireJSON(req, res, "storeName", "records");
  if(data === null) { return; }

  stores.createStore(res, data);
});

// Get a single store by name @TODO
http.onRequest("stores/<store>", "GET", function(req, res) {
  console.say("OntoGen API - GET Stores");
  res.setStatusCode(501);
  res.send();
});

// [onto]: Ontologies
// ------------------
// Example `ontology` document (JSON representation):
//  {
//    $id: 3,
//    name: "textmining",
//    docStore: "news",
//    classifierStore: "textmining_cls",
//    isDeleted: false,
//    links: {
//      self: "/ontogenapi/ontologies/textmining/",
//      concepts: "/ontogenapi/ontologies/textmining/concepts/"
//    }
//  }

// Get List of Existing Ontologies
// Returns: list of `ontology` documents
//  [OntologyDocument1, OntologyDocument2, ...]
http.onRequest("ontologies", "GET", function(req, res) {
  console.say("OntoGen API - GET Existing Ontologies");
  stores.listOntologies(res);
});

// Create a new ontology
// Example:
//  curl -H "Content-Type: application/json" -d \
//  '{"ontologyName":"textmining","dataStore":"news"}' \
//  http://localhost:8080/ontogenapi/ontologies
// Returns: the `ontology`
http.onRequest("ontologies", "POST", function(req, res) {
  console.say("OntoGen API - Create Ontology: ");
  var data = restf.requireJSON(req, res, "ontologyName", "dataStore");
  if(data === null) { return; }
  stores.createOntology(res, data);
});

// Read ontology definition 
// @params: ontology - name of the `ontology`
// Returns: the `ontology`
http.onRequest("ontologies/<ontology>/", "GET", function (req, res) {
  console.say("OntoGen API - Concept ontology def");
  var params = restf.requireParams(req, res, "ontology");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }

  stores.getOntology(res, store);
});

// Documents
// ---------
// A document is a record from the data store associated with the ontology. 
// It includes all fields in the data record. Text fields can optionally be
// summarized (truncated).

// Read - Get All Documents - Summaries only by default
// @params: ontology - the name of the `ontology`
// @args (optional): per_page (optional) - int, number of documents per page
// @args (optional): page (optional) - int, the page number, with `per_page`
// @args (optional): summarize - boolean, weather or not text is truncated
// @returns: list of `document`s, summarized
// Example:
//  curl -X GET "http://localhost:8080/ontogenapi/ontologies/textmining/documents/?page=3&per_page=2&summarize=true?"
http.onRequest("ontologies/<ontology>/documents/", "GET", function (req, res) {
  console.say("OntoGen API - Document GET ALL (summaries)");
  var params = restf.requireParams(req, res, "ontology");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  documents.getDocuments(req, res, store);
});

// Read Document
// @params: ontology - store name of the ontology
// @params: did - record id of document to get
// @returns: a single `document`
http.onRequest("ontologies/<ontology>/documents/<did>/", "GET", 
               function (req, res) {
  console.say("OntoGen API - Document <did> GET");
  var params = restf.requireParams(req, res, "ontology", "did");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var docId = restf.requireInt(res, "did", params.did);
  if(docId === null) { return; }

  documents.getDocument(res, store, params.ontology, docId);
});

// Concepts
// --------
//  {
//    $id: 0,
//    name: "root",
//    keywords: "",
//    stopwords: "none",
//    stemmer: "none",
//    isDeleted: false,
//    classifiers: [ ],
//    parentId: -1,
//    ontology: "textmining",
//    links: {
//              self: "/ontogenapi/ontologies/textmining/concepts/0/",
//              ontology: "/ontogenapi/ontologies/textmining/"
//           }
//  }

// Read - Get all Concepts, @TODO add query parameter here
// @params: ontology - store name of the ontology
// @returns: a list of `concept`s
http.onRequest("ontologies/<ontology>/concepts/", "GET", function (req, res) {
  console.say("OntoGen API - Concept GET ALL");
  var params = restf.requireParams(req, res, "ontology");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }

  concepts.getConcepts(res, store, params.ontology);
});

// Concept - Get a single Concept
// @params: ontology - store name of the ontology
// @params: cid - the record id of the `Concept` to get
// @returns: a `Concept`
http.onRequest("ontologies/<ontology>/concepts/<cid>/", "GET",
               function (req, res) {
  console.say("OntoGen API - Concept GET");
  var params = restf.requireParams(req, res, "ontology", "cid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "cid", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }

  concepts.getConcept(res, store, concept);
});

// Create a Concept
// Example:
//  curl -H "Content-Type: application/json" -d 
//  '{"name":"testc", "parentId":0, "docs":[0,1,3]}'
//  http://localhost:8080/ontogenapi/ontologies/textmining/concepts/
http.onRequest("ontologies/<ontology>/concepts/", "POST", 
               function (req, res) {
  console.say("OntoGen API - Concept POST");
  var params = restf.requireParams(req, res, "ontology");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var data = restf.requireJSON(req, res, "name", "parentId");
  if(data === null) { return; }

  concepts.createConcept(res, data, store, params.ontology);
});

// EDIT a Concept
// Example
//  curl -X PUT -H "Content-Type: application/json" -d '{"name":"hello"}' 
//  http://localhost:8080/ontogenapi/ontologies/textmining/concepts/1/
http.onRequest("ontologies/<ontology>/concepts/<cid>/", "PUT", 
               function (req, res) {
  console.say("OntoGen API - Concept edit PUT");
  var params = restf.requireParams(req, res, "ontology", "cid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var data = restf.requireJSON(req, res);
  if(data === null) { return; }
  var conceptId = restf.requireInt(res, "cid", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }

  concepts.editConcept(res, concept, data, store, params.ontology);
});

// GET subsconcepts
// Returns: the concept children (subconcepts)
http.onRequest("ontologies/<ontology>/concepts/<cid>/subconcepts/", "GET",
               function (req, res) {
  console.say("OntoGen API - GET SUB CONCETPS");
  var params = restf.requireParams(req, res, "ontology", "cid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "cid", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }

  concepts.getSubConcepts(res, concept, store, params.ontology);
});

// DELETE Concept (and sub-concepts)
//  curl -X DELETE 
//  http://localhost:8080/ontogenapi/ontologies/textmining/concepts/1/
http.onRequest("ontologies/<ontology>/concepts/<cid>/", "DELETE",
               function (req, res) {
  console.say("OntoGen API - Concept DELETE");
  var params = restf.requireParams(req, res, "ontology", "cid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }

  concepts.deleteConcept(res, concept, store);
});

// Get List of Document Ids associated with the Concept
http.onRequest("ontologies/<ontology>/concepts/<cid>/docs/", "GET", 
               function (req, res) {
  console.say("OntoGen API - Concept GET docs");
  var params = restf.requireParams(req, res, "ontology", "cid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }

  concepts.getConceptDocuments(req, res, concept, store);
});

// Concept - EDIT Docs - Edit List of Document Ids (Select, DeSelect)
// @data: docId - id of a document to add or remove from the concept
// @data: operation - "add" or "del"
// Returns: array of document ids in the concept
// Example:
//  curl -X PATCH -H "Content-Type: application/json" 
//  -d '{"docId":20, "operation":"add"}' 
//  http://localhost:8080/ontogenapi/ontologies/demo/concepts/1/docs/
http.onRequest("ontologies/<ontology>/concepts/<cid>/docs/", "PATCH",
               function (req, res) {
  console.say("OntoGen API - Concept Edit doc list");
  var params = restf.requireParams(req, res, "ontology", "cid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(concept, "concept");
  if(concept === null) { return; }
  var data = restf.requireJSON(req, res, "operation", "docId");
  if(data === null) { return; }
  var docId = restf.requireInt(res, "docId", data.docId);
  if(docId === null) { return; }

  concepts.editConceptDocuments(res, docId, data.operation, concept, store);
});

// Get Keyword suggestions for concept
// args (optional): numKeywords - number of keywords to get
http.onRequest("ontologies/<ontology>/concepts/<cid>/suggestkeywords/", "GET", 
               function (req, res) {
  console.say("OntoGen API - Concept/suggeskeywords");
  var params = restf.requireParams(req, res, "ontology", "cid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(concept, "concept");
  if(concept === null) { return; }

  var args = req.args || {};
  concepts.getKeywordSuggestions(res, args, concept);
});

// Suggest a subConcept based on search
// args: query
// Returns a subConcept suggestion.
http.onRequest("ontologies/<ontology>/concepts/<cid>/search/", "GET", 
               function (req, res) {
  console.say("OntoGen API - Concept/Search");
  var params = restf.requireParams(req, res, "ontology", "cid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(concept, "concept");
  if(concept === null) { return; }
  var args = restf.requireArgs(req, res, "query");
  if(args === null) { return; }

  concepts.getConceptSuggestionFromQuery(res, concept, store, args.query);
});

// Concept - Suggest sub-concepts
http.onRequest("ontologies/<ontology>/concepts/<cid>/suggest/", "GET",
               function (req, res) {
  console.say("OntoGen API - Concept GET suggestions");
  var params = restf.requireParams(req, res, "ontology", "cid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(concept, "concept");
  if(concept === null) { return; }

  concepts.getConceptSuggestionsByClustering(req, res, concept, store);
});

// Active Learning
// ---------------

// AL - Create
http.onRequest("ontologies/<ontology>/concepts/<cid>/al/", "POST",
               function (req, res) {
  console.say("OntoGen API - AL Create - POST");
  var params = restf.requireParams(req, res, "ontology", "cid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(concept, "concept");
  if(concept === null) { return; }
  var data = restf.requireJSON(req, res, "query");
  var query = data.query;

  al.create(res, data, concept, store, query);
});

// AL - Get Question
http.onRequest("ontologies/<ontology>/concepts/<cid>/al/<alid>/", "GET",
               function (req, res) {
  console.say("OntoGen API - AL/name/ GET");
  var params = restf.requireParams(req, res, "ontology", "cid", "alid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(concept, "concept");
  if(concept === null) { return; }

  var name = params.alid;

  al.getQuestion(res, name, concept, params.ontology);
});

// AL - Answer Question
http.onRequest("ontologies/<ontology>/concepts/<cid>/al/<alid>/", "PATCH",
               function (req, res) {
  console.say("OntoGen API - AL/name/ PATCH");
  var params = restf.requireParams(req, res, "ontology", "cid", "alid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(concept, "concept");
  if(concept === null) { return; }
  var data = restf.requireJSON(req, res, "answer", "did");
  var did = restf.requireInt(res, "did", data.did); // actually did
  var name = params.alid;

  al.answerQuestion(res, name, concept, params.ontology, did, data.answer);
});

// AL - Cancel active learnerning
http.onRequest("ontologies/<ontology>/concepts/<cid>/al/<alid>/", "DELETE",
               function (req, res) {
  console.say("OntoGen API - AL/name/ DELETE");
  var params = restf.requireParams(req, res, "ontology", "cid", "alid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(concept, "concept");
  if(concept === null) { return; }

  var name = params.alid;
  al.cancel(res, name);
});

// AL - Get Concept: finish active learning and create the concept
http.onRequest("ontologies/<ontology>/concepts/<cid>/al/<alid>/", 
               "POST", function (req, res) {
  console.say("OntoGen API - AL/name/ POST");
  var params = restf.requireParams(req, res, "ontology", "cid", "alid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(concept, "concept");
  if(concept === null) { return; }
  var name = params.alid;
 
  al.finish(res, name, concept);
});

// Classifiers (SVM)
// -----------------

// Create classifier for Concept
http.onRequest("ontologies/<ontology>/classifiers/", "POST", 
               function (req, res) {
  console.say("OntoGen API - Concept Classifier - POST");
  var params = restf.requireParams(req, res, "ontology");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var data = restf.requireJSON(req, res, "name", "cid");
  var conceptId = restf.requireInt(res, "conceptId", data.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(concept, "concept");
  if(concept === null) { return; }

  cls.create(res, data, concept, store, params.ontology);
});

// List existing classifiers (models)
http.onRequest("ontologies/<ontology>/classifiers/", "GET",
               function (req, res) {
  console.say("OntoGen API - Classifiers  Get");
  var params = restf.requireParams(req, res, "ontology");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }

  cls.list(res, store);
});

// Classify array of documents
// Example:
//  curl -X POST -H "Content-Type: application/json" 
//  -d '["this is about networks", "this is dog"]' 
//  http://localhost:8080/ontogenapi/ontologies/worktest/classifiers/worktest_network/
http.onRequest("ontologies/<ontology>/classifiers/<mid>/", "POST", 
               function (req, res) {
  console.say("OntoGen API - Classify with model POST");
  var params = restf.requireParams(req, res, "ontology", "mid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var data = restf.requireJSON(req, res);

  cls.classify(res, params.mid, data, store);
});

// Delete a classifier (with ontology parameter)
http.onRequest("ontologies/<ontology>/classifiers/<mid>/", "DELETE",
               function (req, res) {
  console.say("OntoGen API - DELETE Classifier");
  var params = restf.requireParams(req, res, "mid");
  if(params === null) { return; }
  var mid = params.mid;
  cls.deleteClassifier(mid);
  res.send();
});

// Delete a classifier (without ontology parameter)
http.onRequest("ontologies/classifiers/<mid>/", "DELETE", function (req, res) {
  console.say("OntoGen API - DELETE Classifier");
  var params = restf.requireParams(req, res, "mid");
  if(params === null) { return; }
  var mid = params.mid;
  cls.deleteClassifier(mid);
  res.send();
});

// Concept -  GET subsconcepts from classifier
http.onRequest("ontologies/<ontology>/concepts/<cid>/classify/<mid>/", "GET", 
               function (req, res) {
  console.say("OntoGen API - GET SUB CONCETPS FROM CLASSIFIER");
  var params = restf.requireParams(req, res, "ontology", "cid", "mid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(concept, "concept");
  if(concept === null) { return; }
  var args = req.args || {};
  var threshold = restf.optionalFloat(args, "thresh", 0);
  var mid = params.mid;

  cls.subConcepts(res, mid, threshold, concept, store);
});

/// List existing classifiers (models) for ALL ontologies
http.onRequest("classifiers/", "GET", function (req, res) {
  console.say("OntoGen API - Classifiers  Get ALL");
  cls.listAll(res);
});
