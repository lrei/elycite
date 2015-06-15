// Elycite - Routing - Main Module

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
// For example, in *http://example.com/[resources]/[item]/* both *[resources]*  
// and *[item]* are `params` to be replaced accordingly.
// * **ARGS** refers to HTTP GET query strings. For example, in 
// *http://example.com/<resources>/?q=hello&w=world* both *q* and *w* are
// `args` that take the value *hello* and *world*, respectively.
// * **JSONDATA** is the JSON content of a request which requires the 
// HTTP "Content-Type" header to be set to "application/json".
 
// Options
// --------------
// #### /languageoptions/
//
// **Method:** GET
//
// **Description:** Get Language Options
//
// **Returns:** Options for stemmers and stopword lists
//
//    { stemmer: ["none", "porter"], stopwords: ["none", "en8", ...] }
http.onRequest("languageoptions", "GET", function(req, res) {
  console.say("elycite API - Language Options");

  var LangOpts = analytics.getLanguageOptions();
  res.send(LangOpts);
});

// Stores
// ------
// Stores refer to data stores i.e. does not include ontology stores

// #### /stores/ 
//
// **METHOD:** GET
//
// **Description:** Get List of available Data (Document) Stores
//
// **Returns:** A list of qminer store definitions
http.onRequest("stores", "GET", function(req, res) {
  console.say("elycite API - GET Stores");
  stores.listStores(res);
});

// **METHOD:** POST
//
// **Description:** Create a data (document) store with records
//
// **JSON DATA:**
//<pre><code>
//  {
//    storeName: "exampleName",
//    records: [{RecVal1}, ...]
//  }
//</code></pre>
http.onRequest("stores/", "POST", function(req, res) {
  console.say("elycite API - POST Stores");
  var data = restf.requireJSON(req, res, "name", "records");
  if(data === null) { return; }

  stores.createStore(res, data);
});
// #### /stores/[store]/
//
// **METHOD:** GET
//
// **Description:** Read store definition 
//
// **PARAMS:**
//
//  * *store* - the store name
//
// **Returns:** the `store` JSON representation. 
http.onRequest("stores/<store>/", "GET", function(req, res) {
  console.say("elycite API - GET Store");
  var params = restf.requireParams(req, res, "store");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.store);
  if(store === null) { return; }

  stores.getStore(res, store);
});

// Records
// -------
// A qminer record in this datastore. 

// #### /stores/[store]/records/
//
// **METHOD:** GET
//
// **Description:** Get All Records 
//
// **PARAMS:**
//
//  * *store* - the store name
//
// **ARGS:**
// 
//  * *per_page* (int, optional) - number of records per page
//  * *page* (int, optional) - the page number, with `per_page` records
//
// **RETURNS:** list of `record`s (see above).
//
// **Example:** 
//<pre><code>
//  curl -X GET \
//  "http://localhost:8080/elyciteapi/stores/testdata/records/?page=3&per_page=2"
//</code></pre>
http.onRequest("stores/<store>/records/", "GET", function (req, res) {
  console.say("elycite API - Records GET ALL");
  var params = restf.requireParams(req, res, "store");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.store);
  if(store === null) { return; }
  var pargs = restf.paginationArguments(req, 100);
  stores.getRecords(res, store, pargs.page, pargs.per_page);
});

// #### /stores/[store]/records/
//
// **METHOD:** POST
//
// **Description:** Add a record or array of records
//
// **PARAMS:**
//
//  * *store* - the store name
//
// **JSONDATA:**
//<pre><code>
//  {
//    records:["array of records"]
//  }
//</code></pre>
// 
// **RETURNS:** 201 OK.
http.onRequest("stores/<store>/records/", "POST", function (req, res) {
  console.say("elycite API - Records POST");
  var params = restf.requireParams(req, res, "store");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.store);
  if(store === null) { return; }
  var records = restf.requireJSON(req, res);
  if(records === null) { return; }
  stores.createRecords(res, store, records);
});


// #### /stores/[store]/records/[rid]/
//
// **METHOD:** GET
//
// **Description:** Read Record
//
// **PARAMS:**
//
//  * *store* - the ontology name
//  * *rid* - record id to get
//
// **RETURNS:** a single `document`
http.onRequest("stores/<store>/records/<rid>/", "GET", 
               function (req, res) {
  console.say("elycite API - Document <did> GET");
  var params = restf.requireParams(req, res, "store", "rid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.store);
  if(store === null) { return; }
  var recId = restf.requireInt(res, "rid", params.rid);
  if(recId === null) { return; }
  var rec = stores.requireRecord(res, store, "record", recId);
  if(rec == null) { return; }
  res.send(rec.toJSON());
});


// Ontologies
// -----------
// Example `ontology` document (JSON representation):
//<pre><code>
//  {
//      $id: 3,
//      name: "textmining",
//      docStore: "news",
//      classifierStore: "textmining_cls",
//      isDeleted: false,
//      links: {
//        self: "/elyciteapi/ontologies/textmining/",
//        concepts: "/elyciteapi/ontologies/textmining/concepts/"
//      }
//    }
//</code></pre>

// #### /ontologies/
//
// **METHOD:** GET
//
// **Description:** Get List of Existing Ontologies
//
// **Returns:** list of `ontology` documents
//
//    [OntologyDocument1, OntologyDocument2, ...]
http.onRequest("ontologies", "GET", function(req, res) {
  console.say("elycite API - GET Existing Ontologies");
  stores.listOntologies(res);
});

// **METHOD:** POST
//
// **Description:** Create a new ontology
//
// **JSONDATA:**
//<pre><code>
//  {
//    ontologyName: "new_ontology", 
//    dataStore:"news_data"
//  }
//</code></pre>
//
// **Returns:** the `ontology`
//
// **Example Request:**
//<pre><code>
//    curl -H "Content-Type: application/json" -d \
//    '{"ontologyName":"textmining","dataStore":"news"}' \
//    http://localhost:8080/elyciteapi/ontologies
//</code></pre>
http.onRequest("ontologies", "POST", function(req, res) {
  console.say("elycite API - Create Ontology: ");
  var data = restf.requireJSON(req, res, "ontologyName", "dataStore");
  if(data === null) { return; }
  stores.createOntology(res, data);
});

// #### /ontologies/[ontology]/
//
// **METHOD:** GET
//
// **Description:** Read ontology definition 
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//
// **Returns:** the `ontology` JSON representation. See above.
http.onRequest("ontologies/<ontology>/", "GET", function (req, res) {
  console.say("elycite API - Concept ontology def");
  var params = restf.requireParams(req, res, "ontology");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }

  stores.getOntology(res, store);
});

// #### /ontologies/[ontology]/export/
//
// **METHOD:** GET
//
// **Description:** Get export version of concepts (ontology export)
// 
// **PARAMS:**
//
//  * *ontology* - the ontology name
//
// **ARGS:**
//
//  * *fields* - list of document store field names to be included
//
// **RETURNS:** a list of `concept`s
http.onRequest("ontologies/<ontology>/export/", "GET", 
    function (req, res) {
  console.say("elycite API - Ontology - Export");
  var params = restf.requireParams(req, res, "ontology");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var args = restf.requireArgs(req, res, "filename", "fields[]");
  if(args === null) { return; }
  //var fields = restf.optional(args, 'fields', []);

  concepts.exportConcepts(res, store, args["fields[]"], args.filename);

});

// Documents
// ---------
// A document is a record from the data store associated with the ontology. 
// It includes all fields in the data (qminer( record. 
// Text fields can optionally be summarized (truncated).

// #### /ontologies/[ontology]/documents/
//
// **METHOD:** GET
//
// **Description:** Get All Documents - Summaries only by default
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
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
//  "http://localhost:8080/elyciteapi/ontologies/test/documents/?page=3&per_page=2&summarize=true?"
//</code></pre>
http.onRequest("ontologies/<ontology>/documents/", "GET", function (req, res) {
  console.say("elycite API - Document GET ALL (summaries)");
  var params = restf.requireParams(req, res, "ontology");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  documents.getDocuments(req, res, store);
});

// #### /ontologies/[ontology]/documents/[did]/
//
// **METHOD:** GET
//
// **Description:** Read Document
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *did* - record id of document to get
//
// **RETURNS:** a single `document`
http.onRequest("ontologies/<ontology>/documents/<did>/", "GET", 
               function (req, res) {
  console.say("elycite API - Document <did> GET");
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
//              self: "/elyciteapi/ontologies/textmining/concepts/0/",
//              ontology: "/elyciteapi/ontologies/textmining/"
//           }
//  }
//</code></pre>

// #### /ontologies/[ontology]/concepts/
//
// **METHOD:** GET
//
// **Description:** Get all `concept`s (see above)
// 
// **PARAMS:**
//
//  * *ontology* - the ontology name
//
// **ARGS:**
//
//  * *query* (string, optional) - query to filter concepts @TODO NOT IMPLEMENTED
//
// **RETURNS:** a list of `concept`s
http.onRequest("ontologies/<ontology>/concepts/", "GET", function (req, res) {
  console.say("elycite API - Concept GET ALL");
  var params = restf.requireParams(req, res, "ontology");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }

  concepts.getConcepts(res, store, params.ontology);
});

//
// **METHOD:** POST
//
// **Description:** Create a `concept`
// 
// **PARAMS:**
//
//  * *ontology* - the ontology name
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
//  http://localhost:8080/elyciteapi/ontologies/textmining/concepts/
//</code></pre>
http.onRequest("ontologies/<ontology>/concepts/", "POST", 
               function (req, res) {
  console.say("elycite API - Concept POST");
  var params = restf.requireParams(req, res, "ontology");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var data = restf.requireJSON(req, res, "name", "parentId");
  if(data === null) { return; }

  concepts.createConcept(res, data, store, params.ontology);
});

// #### /ontologies/[ontology]/concepts/[cid]/
//
// **METHOD:** GET
//
// **Description:** Get a single `concept`
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *cid* - the record id of the `concept` to get
//
// **RETURNS:** the `concept`
http.onRequest("ontologies/<ontology>/concepts/<cid>/", "GET",
               function (req, res) {
  console.say("elycite API - Concept GET");
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

//
// **METHOD:** PUT
//
// **Description:** Edit a `concept`
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *cid* - the record id of the concept do edit
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
//  http://localhost:8080/elyciteapi/ontologies/textmining/concepts/1/
//</code></pre>
http.onRequest("ontologies/<ontology>/concepts/<cid>/", "PUT", 
               function (req, res) {
  console.say("elycite API - Concept edit PUT");
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

//
// **METHOD:** DELETE
//
// **Description:** Delete this `concept` including subconcepts (recursively).
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *cid* - the record id of the concept to delete
//
// **EXAMPLE REQUEST:**
//<pre><code>
//  curl -X DELETE \
//  http://localhost:8080/elyciteapi/ontologies/textmining/concepts/1/
//</code></pre>
http.onRequest("ontologies/<ontology>/concepts/<cid>/", "DELETE",
               function (req, res) {
  console.say("elycite API - Concept DELETE");
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

// #### /ontologies/<ontology>/concepts/[cid]/subconcepts/
//
// **METHOD:** GET
//
// **Description:** get a list of `concept`s that are subsconcepts (children) 
// of this `concept`
//
// **PARAMS:**
//
//
//  * *ontology* - the ontology name
//  * *cid* - the record id of this concept
//
// **RETURNS:** an array containing `concept`s that are the `concept`'s 
// subconcepts (children)
http.onRequest("ontologies/<ontology>/concepts/<cid>/subconcepts/", "GET",
               function (req, res) {
  console.say("elycite API - GET SUB CONCETPS");
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

// #### /ontologies/[ontology]/concepts/[cid]/docs/
//
// **METHOD:** GET
//
// **Description:** Get a list of `document` record ids that are in the
// `concept`
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *cid* - the record id of the concept
//
// **RETURNS:** an array of `document` record ids (ints)
http.onRequest("ontologies/<ontology>/concepts/<cid>/docs/", "GET", 
               function (req, res) {
  console.say("elycite API - Concept GET docs?");
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

//
// **METHOD:** PATCH
//
// **DESCRIPTION**: Edit the list of `document` record ids in the `concept`
// (Select, DeSelect)
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *cid* - the record id of the concept
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
//  http://localhost:8080/elyciteapi/ontologies/demo/concepts/1/docs/
//</code></pre>
http.onRequest("ontologies/<ontology>/concepts/<cid>/docs/", "PATCH",
               function (req, res) {
  console.say("elycite API - Concept Edit doc list");
  var params = restf.requireParams(req, res, "ontology", "cid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(res, concept, "concept");
  if(concept === null) { return; }
  var data = restf.requireJSON(req, res, "operation", "docId");
  if(data === null) { return; }
  var docId = restf.requireInt(res, "docId", data.docId);
  if(docId === null) { return; }

  concepts.editConceptDocuments(res, docId, data.operation, concept, store);
});

// #### /ontologies/[ontology]/concepts/[cid]/suggestkeywords/
//
// **METHOD:** GET
//
// **Description:** Get keyword suggestions for a `concept`
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *cid* - the record id of the concept
//
// **ARGS:**
//
// * *numKeywords* (int, optional) - number of keywords to get
//
// **RETURNS:** a JSON object with a `keywords` string property consisting of 
// the suggested keywords separated by a comma an a space. Example:
// <pre><code>
//  {
//    "keywords":"services, bank, business, management, markets"
//  }
//</code></pre>
http.onRequest("ontologies/<ontology>/concepts/<cid>/suggestkeywords/", "GET", 
               function (req, res) {
  console.say("elycite API - Concept/suggeskeywords");
  var params = restf.requireParams(req, res, "ontology", "cid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(res, concept, "concept");
  if(concept === null) { return; }

  var args = restf.requireArgs(req, res, "fieldName");
  var fieldName = args.fieldName[0];
  concepts.getKeywordSuggestions(res, args, concept, fieldName);
});

// #### /ontologies/[ontology]/concepts/[cid]/search/
//
// **METHOD:** GET
//
// **Description:** Suggest a subconcept based on search
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *cid* - the record id of the concept
//
// **ARGS:**
//
//  * *query* (string) - the query used to create the suggestion
//
// **RETURNS:** a concept suggestion (`concept` without id or generated
// properties). Example:
//<pre><code>
//  {
//    name: "software",
//    keywords: "services, solutions, systems, management, technology, network",
//    parentId: 0,
//    docs: [3, 5, ...]
//  }
//</code></pre>
http.onRequest("ontologies/<ontology>/concepts/<cid>/search/", "GET", 
               function (req, res) {
  console.say("elycite API - Concept/Search");
  var params = restf.requireParams(req, res, "ontology", "cid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(res, concept, "concept");
  if(concept === null) { return; }
  var args = restf.requireArgs(req, res, "query", "fieldName");
  if(args === null) { return; }
  var fieldName = args.fieldName[0];

  concepts.getConceptSuggestionFromQuery(res, concept, store, fieldName,
                                         args.query);
});

// #### /ontologies/[ontology]/concepts/[cid]/query/
//
// **METHOD:** GET
//
// **Description:** Get all the documents from a concept 
//       that contain the query
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *cid* - the record id of the concept
//
// **ARGS:**
//
//  * *query* (string) - the query that all the documents must contain
//
// **RETURNS:** a list of documents that contain the query.
http.onRequest("ontologies/<ontology>/concepts/<cid>/query/", "GET", 
               function (req, res) {
  console.say("elycite API - Concept/Query");
  var params = restf.requireParams(req, res, "ontology", "cid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(res, concept, "concept");
  if(concept === null) { return; }
  var args = restf.requireArgs(req, res, "docIds");
  if(args === null) { return; }

  //concepts.getConceptDocsFromSearch(res, concept, store, args.docIds, params); 
  documents.getSpecificDocuments(res, store, params.ontology, args.docIds)
});


// #### /ontologies/[ontology]/concepts/[cid]/suggest/
//
// **METHOD:** GET
//
// **Description:** Suggest subconcepts (clustering based)
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *cid* - the record id of the concept
//
// **ARGS:**
//
//  * *stemmer* (string, optional) - "none", "porter" see /languageoptions/
//  * *stopwords* (string, optional) - see /languageoptions/
//  * *numSuggest* (int, optional) - number of `concept` suggestions
//  * *numIter* (int, optional) - number of iterations of the clustering
//  algorithm
//  * *numKeywords* (int, optional) - number of keywords per concept
//
// **RETURNS:** an array of concept suggestions (`concept`s without id or 
// generated properties). See the return of /search/ above.
http.onRequest("ontologies/<ontology>/concepts/<cid>/suggest/", "GET",
               function (req, res) {
  console.say("elycite API - Concept GET suggestions");
  var params = restf.requireParams(req, res, "ontology", "cid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(res, concept, "concept");
  if(concept === null) { return; }
  var args  = restf.requireArgs(req, res, "fieldName");
  if(args === null) { return; }

  concepts.getConceptSuggestionsByClustering(req, res, concept, store);
});

// Active Learning
// ---------------
// While there is no actual "active learner document", there is a `question`
// document where the `id` attribute refers to the AL and the questionId is the 
// id of the data associated with the question:
//<pre><code>
//  {
//    "questionId":128,
//    "id":"medical_1936769238",
//    "links":{
//      "self":"/elyciteapi/ontologies/undefined/concepts/0/al/medical_1936769238/"
//    },
//    "text":"Develops and manages medical facilities...",
//    "mode":false
//  }
//</pre></code>
//  If mode is true, the `question` also includes all necessary information to
//  create a new concept
//<pre><code>
//  {
//    ...
//    "mode":true,
//    "count":518,
//    "docs":[75,...],
//    "name": "medical, services, products",
//    "keywords":, "medical, ..."
//  }
//</pre></code>

// #### /ontologies/[ontology]/concepts/[cid]/al/
//
// **METHOD:** POST
//
// **Description:** Create Active Learner for a given query
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *cid* - the record id of the concept
//
// **JSONDATA:**
//
//  * *query* (string) - query to search for documents (seed positive
//  concepts).
//
// **RETURNS:** An initial `question`.
http.onRequest("ontologies/<ontology>/concepts/<cid>/al/", "POST",
               function (req, res) {
  console.say("elycite API - AL Create - POST");
  var params = restf.requireParams(req, res, "ontology", "cid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(res, concept, "concept");
  if(concept === null) { return; }
  var data = restf.requireJSON(req, res, "query", "fieldName");
  var query = data.query;
  var fieldName = data.fieldName;

  al.create(res, data, concept, store, query, fieldName);
});

// #### /ontologies/[ontology]/concepts/[cid]/al/[alid]/
//
// **METHOD:** GET
//
// **Description:** Get a question from an active learner.
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *cid* - the record id of the concept
//  * *alid* - the active learner id
//
// **RETURNS:** A `question`.
http.onRequest("ontologies/<ontology>/concepts/<cid>/al/<alid>/", "GET",
               function (req, res) {
  console.say("elycite API - AL/name/ GET");
  var params = restf.requireParams(req, res, "ontology", "cid", "alid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(res, concept, "concept");
  if(concept === null) { return; }

  var name = params.alid;

  al.getQuestion(res, name, concept, params.ontology);
});

// **METHOD:** PATCH
//
// **Description:** Answer a question from an active learner.
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *cid* - the record id of the concept
//  * *alid* - the active learner id
// 
// **JSONDATA:**
//
//  * *did* - the questionId of the question being answered
//  * *answer* - 0 or 1 (integer) = no or yes, respectively
//
// **RETURNS:** The next `question`.
http.onRequest("ontologies/<ontology>/concepts/<cid>/al/<alid>/", "PATCH",
               function (req, res) {
  console.say("elycite API - AL/name/ PATCH");
  var params = restf.requireParams(req, res, "ontology", "cid", "alid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(res, concept, "concept");
  if(concept === null) { return; }
  var data = restf.requireJSON(req, res, "answer", "did");
  var did = restf.requireInt(res, "did", data.did); // actually did
  var name = params.alid;

  al.answerQuestion(res, name, concept, params.ontology, did, data.answer);
});

// **METHOD:** DELETE
//
// **Description:** Cancel (DELETE) active learner.
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *cid* - the record id of the concept
//  * *alid* - the active learner id
http.onRequest("ontologies/<ontology>/concepts/<cid>/al/<alid>/", "DELETE",
               function (req, res) {
  console.say("elycite API - AL/name/ DELETE");
  var params = restf.requireParams(req, res, "ontology", "cid", "alid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(res, concept, "concept");
  if(concept === null) { return; }

  var name = params.alid;
  al.cancel(res, name);
});

// **METHOD:** POST
//
// **Description:** Get Concept: finish active learning and create the concept
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *cid* - the record id of the concept
//  * *alid* - the active learner id
//
// **RETURNS:** The `concept` created.
http.onRequest("ontologies/<ontology>/concepts/<cid>/al/<alid>/", 
               "POST", function (req, res) {
  console.say("elycite API - AL/name/ POST");
  var params = restf.requireParams(req, res, "ontology", "cid", "alid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(res, concept, "concept");
  if(concept === null) { return; }
  var name = params.alid;
 
  al.finish(res, name, concept);
});

// Classifiers (SVM)
// -----------------
//<pre><code>
//  {
//    "id":"classifier_name",
//    "links":{
//      "self":"/elyciteapi/ontologies/blahblah/classifiers/classifier_name/",
//      "ontology":"/elyciteapi/ontologies/blahblah/"
//    }
//  }
//</pre></code>
// #### /ontologies/[ontology]/classifiers/
// **METHOD:** POST
//
// **Description:** List existing classifiers (models).
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//
// **RETURNS:** A list of `classifier`s.
http.onRequest("ontologies/<ontology>/classifiers/", "GET",
               function (req, res) {
  console.say("elycite API - Classifiers  Get");
  var params = restf.requireParams(req, res, "ontology");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }

  cls.list(res, store);
});

// **METHOD:** POST
//
// **Description:** Create classifier for a Concept.
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//
// **JSONDATA:**
//
//  * *cid* - the record id of the concept
//  * *name* - name for the classifier (mid)
//
// **RETURNS:** The `classifier` created.
http.onRequest("ontologies/<ontology>/classifiers/", "POST", 
               function (req, res) {
  console.say("elycite API - Concept Classifier - POST");
  var params = restf.requireParams(req, res, "ontology");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var data = restf.requireJSON(req, res, "name", "cid", "fieldName");
  var conceptId = restf.requireInt(res, "conceptId", data.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(res, concept, "concept");
  if(concept === null) { return; }

  cls.create(res, data, concept, store, params.ontology);
});

// #### /ontologies/[ontology]/classifiers/[mid]/
//
// **METHOD:** POST
//
// **Description:** Classify array of documents.
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *mid* - the classifier name (model id)
//
// **RETURNS:** An array of decision functions (negative or positive numbers).
// 
// Example:
//<pre><code>
//  curl -X POST -H "Content-Type: application/json" \
//  -d '["this is about networks", "this is dog"]' \
//  http://localhost:8080/elyciteapi/ontologies/worktest/classifiers/worktest_network/
//</pre></code>
http.onRequest("ontologies/<ontology>/classifiers/<mid>/", "POST", 
               function (req, res) {
  console.say("elycite API - Classify with model POST");
  var params = restf.requireParams(req, res, "ontology", "mid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var data = restf.requireJSON(req, res);

  cls.classify(res, params.mid, data, store);
});

// **METHOD:** DELETE
//
// **Description:** Delete a classifier (with ontology parameter).
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *mid* - the classifier name (model id)
// 
http.onRequest("ontologies/<ontology>/classifiers/<mid>/", "DELETE",
               function (req, res) {
  console.say("elycite API - DELETE Classifier");
  var params = restf.requireParams(req, res, "mid");
  if(params === null) { return; }
  var mid = params.mid;
  cls.deleteClassifier(mid);
  res.send();
});

// #### /ontologies/[ontology]/classifiers/[mid]/
//
// **METHOD:** POST
//
// **Description:** Get (binary) subsconcepts from classifier.
//
// **PARAMS:**
//
//  * *ontology* - the ontology name
//  * *cid* - the id of the concept from which the subconcepts will be created 
//  * *mid* - the classifier name (model id)
//
// **RETURNS:** Array with positive and negative sub`concept`s. 
http.onRequest("ontologies/<ontology>/concepts/<cid>/classify/<mid>/", "GET", 
               function (req, res) {
  console.say("elycite API - GET SUB CONCETPS FROM CLASSIFIER");
  var params = restf.requireParams(req, res, "ontology", "cid", "mid");
  if(params === null) { return; }
  var store = stores.requireExists(res, params.ontology);
  if(store === null) { return; }
  var conceptId = restf.requireInt(res, "conceptId", params.cid);
  if(conceptId === null) { return; }
  var concept = stores.requireRecord(res, store, "concept", conceptId);
  if(concept === null) { return; }
  concept = restf.requireNotDeleted(res, concept, "concept");
  if(concept === null) { return; }
  var args = req.args || {};
  var threshold = restf.optionalFloat(args, "thresh", 0);
  var mid = params.mid;

  cls.subConcepts(res, mid, threshold, concept, store);
});

// #### /classifiers/
//
// **METHOD:** GET
//
// **Description:** List existing classifiers (models) for ALL ontologies
//
//
// **RETURNS:** A list of `classifier`s. 
http.onRequest("classifiers/", "GET", function (req, res) {
  console.say("elycite API - Classifiers  Get ALL");
  cls.listAll(res);
});

// #### /classifiers/[mid]/
//
// **METHOD:** DELETE
//
// **Description:** Delete a classifier (without ontology parameter)
//
// **PARAMS:**
//
//  * *mid* - the classifier name (model id)
http.onRequest("classifiers/<mid>/", "DELETE", function (req, res) {
  console.say("elycite API - DELETE Classifier");
  var params = restf.requireParams(req, res, "mid");
  if(params === null) { return; }
  var mid = params.mid;
  cls.deleteClassifier(mid);
  res.send();
});