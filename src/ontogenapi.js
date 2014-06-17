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


// Introductory Notes
// -------------------
//
// * Trailing slashes are important! .../documents/ not ../documents
// * Generally, all document representations include a links property 
// containing at least a links.self
// * **PARAMS** refers to URL parameters such as collections and elements.
// For example, in *http://example.com/<resources>/<item>/* both *<resources>*  
// and *<item>* are `params` to be replaced accordingly.
// * **ARGS** refers to HTTP GET query strings. For example, in 
// *http://example.com/<resources>/?q=hello&w=world* both *q* and *w* are
// `args` that take the value *hello* and *world*, respectively.
// * **JSONDATA** is the JSON content of a request which requires the 
// HTTP "Content-Type" header to be set to "application/json".
 
// Misc
// -----
// **URL:** /languageoptions/
//
// **Method:** GET
//
// **DESCRIPTION:** Get Language Options
//
// **Returns:** Options for stemmers and stopword lists
//
//    { stemmer: ["none", "porter"], stopwords: ["none", "en8", ...] }
http.onRequest("languageoptions", "GET", function(req, res) {
  console.say("OntoGen API - Language Options");

  var LangOpts = analytics.getLanguageOptions();
  res.send(LangOpts);
});

// Stores
// ------

// **URL:** /stores/ 
//
// **METHOD:** GET
//
// **DESCRIPTION:** Get List of available Data (Document) Stores
//
// **Returns:** A list of qminer store definitions
http.onRequest("stores", "GET", function(req, res) {
  console.say("OntoGen API - GET Stores");
  stores.listStores(res);
});

// **URL:** /stores/
//
// **METHOD:** POST
//
// **DESCRIPTION:** Create a data (document) store with records
//
// **JSON DATA:**
//
//    {storeName: "exampleName", records: [{RecVal1}, ...]} 
http.onRequest("stores/", "POST", function(req, res) {
  console.say("OntoGen API - POST Stores");
  var data = restf.requireJSON(req, res, "storeName", "records");
  if(data === null) { return; }

  stores.createStore(res, data);
});

// Get a single store definition by name @TODO: NOT IMPLEMENTED
http.onRequest("stores/<store>", "GET", function(req, res) {
  console.say("OntoGen API - GET Stores");
  res.setStatusCode(501);
  res.send();
});

// Ontologies
// -----------
// Example `ontology` document (JSON representation):
//
//<pre><code>
//  {
//      $id: 3,
//      name: "textmining",
//      docStore: "news",
//      classifierStore: "textmining_cls",
//      isDeleted: false,
//      links: {
//        self: "/ontogenapi/ontologies/textmining/",
//        concepts: "/ontogenapi/ontologies/textmining/concepts/"
//      }
//    }
//</code></pre>

// **URL:** /ontologies/
//
// **METHOD:** GET
//
// **DESCRIPTION:** Get List of Existing Ontologies
//
// **Returns:** list of `ontology` documents
//
//    [OntologyDocument1, OntologyDocument2, ...]
http.onRequest("ontologies", "GET", function(req, res) {
  console.say("OntoGen API - GET Existing Ontologies");
  stores.listOntologies(res);
});

// **URL:** /ontologies/
//
// **METHOD:** POST
//
// **DESCRIPTION:** Create a new ontology
//
// **JSONDATA:**
//
//  {ontologyName: "new_ontology", dataStore:"news_data"}
//
// **Returns:** the `ontology`
//
// **Example Request:**
//<pre><code>
//    curl -H "Content-Type: application/json" -d \
//    '{"ontologyName":"textmining","dataStore":"news"}' \
//    http://localhost:8080/ontogenapi/ontologies
//</code></pre>
http.onRequest("ontologies", "POST", function(req, res) {
  console.say("OntoGen API - Create Ontology: ");
  var data = restf.requireJSON(req, res, "ontologyName", "dataStore");
  if(data === null) { return; }
  stores.createOntology(res, data);
});

// **URL:** /ontologies/<ontology>/
//
// **METHOD:** GET
//
// **DESCRIPTION:** Read ontology definition 
//
// **PARAMS:**
//
//  * *<ontology>* - the ontology name
//
// **Returns:** the `ontology` JSON representation. See above.
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
// It includes all fields in the data (qminer( record. 
// Text fields can optionally be summarized (truncated).

// **URL:** /ontologies/<ontology>/documents/
//
// **METHOD:** GET
//
// **DESCRIPTION:** Get All Documents - Summaries only by default
//
// **PARAMS:**
//
//  * *<ontology>* - the ontology name
//
// **ARGS:**
// 
//  * *per_page* (int, optional) - number of documents per page
//  * *page* (int, optional) - the page number, with `per_page` documents
//  * *summarize* (boolean, optional, default: true), truncate text fields
//
// **RETURNS:** list of `document`s (see above).
//
// **Example:** 
//<pre><code>
//  curl -X GET \
//  "http://localhost:8080/ontogenapi/ontologies/test/documents/?page=3&per_page=2&summarize=true?"
//</code></pre>
http.onRequest("ontologies/<ontology>/documents/", "GET", function (req, res) {
  console.say("OntoGen API - Document GET ALL (summaries)");
  var params = restf.requireParams(req, res, "ontology");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  documents.getDocuments(req, res, store);
});

// **URL:** /ontologies/<ontology>/documents/<did>/
//
// **METHOD:** GET
//
// **DESCRIPTION:** Read Document
//
// **PARAMS:**
//
//  * *<ontology>* - the ontology name
//  * *<did>* - record id of document to get
//
// **RETURNS:** a single `document`
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
//<pre><code>
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
//</code></pre>

// **URL:** /ontologies/<ontology>/concepts/
//
// **METHOD:** GET
//
// **DESCRIPTION:** Get all `concept`s (see above)
// 
// **PARAMS:**
//
//  * *<ontology>* - the ontology name
//
// **ARGS:**
//
//  * *query* (string, optional) - query to filter concepts @TODO NOT IMPLEMENTED
//
// **RETURNS:** a list of `concept`s
http.onRequest("ontologies/<ontology>/concepts/", "GET", function (req, res) {
  console.say("OntoGen API - Concept GET ALL");
  var params = restf.requireParams(req, res, "ontology");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }

  concepts.getConcepts(res, store, params.ontology);
});

// **URL:** /ontologies/<ontology>/concepts/<cid>/
//
// **METHOD:** GET
//
// **DESCRIPTION:** Get a single `concept`
//
// **PARAMS:**
//
//  * *<ontology>* - the ontology name
//  * *<cid>* - the record id of the `concept` to get
//
// **RETURNS:** the `concept`
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

// **URL:** /ontologies/<ontology>/concepts/
//
// **METHOD:** POST
//
// **DESCRIPTION:** Create a `concept`
// 
// **PARAMS:**
//
//  * *<ontology>* - the ontology name
//
// **JSONDATA:**  A JSON representation of non-calculated `concept` properties.
//
//  * *name* (string) - the new `concept`'s name
//  * *parentId* (int) - the id of the parent `concept`
//  * *stemmer* (string, optional) - "none", "porter" see /languageoptions/
//  * *stopwords* (string, optional): see /languageoptions/
//  * *docs* (array) - an array of document ids that will be in the `concept`
//
// **EXAMPLE REQUEST:**
//<pre><code>
//  curl -H "Content-Type: application/json" -d \
//  '{"name":"testc", "parentId":0, "docs":[0,1,3]}' \
//  http://localhost:8080/ontogenapi/ontologies/textmining/concepts/
//</code></pre>
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

// **URL:** /ontologies/<ontology>/concepts/<cid>/
//
// **METHOD:** PUT
//
// **DESCRIPTION:** Edit a `concept`
//
// **PARAMS:**
//
//  * *<ontology>* - the ontology name
//  * *<cid>* - the record id of the concept do edit
//
//  **JSONDATA:**
//
//  * *name* (string, optional) - the `concept`'s name
//  * *parentId* (int, optional) - the id of the parent `concept`
//  * *stemmer* (string, optional) - "none", "porter" see /languageoptions/
//  * *stopwords* (string, optional): see /languageoptions/
//
// **EXAMPLE REQUEST:**
//<pre><code>
//  curl -X PUT -H "Content-Type: application/json" -d '{"name":"hello"}' \ 
//  http://localhost:8080/ontogenapi/ontologies/textmining/concepts/1/
//</code></pre>
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

// **URL:** /ontologies/<ontology>/concepts/<cid>/subconcepts/
//
// **METHOD:** GET
//
// **DESCRIPTION:** get a list of `concept`s that are subsconcepts (children) 
// of this `concept`
//
// **PARAMS:**
//
//  * *<ontology>* - the ontology name
//  * *<cid>* - the record id of this concept
//
// **RETURNS:** an array containing `concept`s that are the `concept`'s 
// subconcepts (children)
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

// **URL:** /ontologies/<ontology>/concepts/<cid>/
//
// **METHOD:** DELETE
//
// **DESCRIPTION:** Delete this `concept` including subconcepts (recursively).
//
// **PARAMS:**
//
//  * *<ontology>* - the ontology name
//  * *<cid>* - the record id of the concept to delete
//
// **EXAMPLE REQUEST:**
//  curl -X DELETE \
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

// **URL:** /ontologies/<ontology>/concepts/<cid>/docs/
//
// **METHOD:** GET
//
// **DESCRIPTION:** Get a list of `document` record ids that are in the
// `concept`
//
// **PARAMS:**
//
//  * *<ontology>* - the ontology name
//  * *<cid>* - the record id of the concept
//
// **RETURNS:** an array of `document` record ids (ints)
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

// **URL:**  /ontologies/<ontology>/concepts/<cid>/docs/
//
// **METHOD:** PATCH
//
// **DESCRIPTION**: Edit the list of `document` record ids in the `concept`
// (Select, DeSelect)
//
// **PARAMS:**
//
//  * *<ontology>* - the ontology name
//  * *<cid>* - the record id of the concept
//
// **JSONDATA:**
//
//  * *docId* (int) - id of a `document` to add or remove from the concept
//  *operation* (string) - "add" or "del" to add or remove, respectively, the 
//  `document` id from the list
//
// **RETURNS:** an array with the `document` record ids in the concept
//
// **EXAMPLE REQUEST:**
//<pre><code>
//  curl -X PATCH -H "Content-Type: application/json" \
//  -d '{"docId":20, "operation":"add"}' \
//  http://localhost:8080/ontogenapi/ontologies/demo/concepts/1/docs/
//</code></pre>
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

// **URL:** /ontologies/<ontology>/concepts/<cid>/suggestkeywords/
//
// **METHOD:** GET
//
// **DESCRIPTION:** Get keyword suggestions for a `concept`
//
// **ARGS:**
//
// * *numKeywords* (int, optional) - number of keywords to get
//
// **RETURNS:** a JSON object with a `keywords` string property consisting of 
// the suggested keywords separated by a comma an a space. Example:
// <pre><code>
// {"keywords":"services, bank, business, management, markets"}
//</code></pre>
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

// List existing classifiers (models) for ALL ontologies
http.onRequest("classifiers/", "GET", function (req, res) {
  console.say("OntoGen API - Classifiers  Get ALL");
  cls.listAll(res);
});
