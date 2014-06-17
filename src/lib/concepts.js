// Ontogen - Concept Management Module

// (c) 2013-2014 Luis Rei, Josef Stefan Institute
// MIT License

var analytics = require('analytics.js');
var restf = require('restf.js');
var documents = require('documents.js');
var stores = require('stores.js');
var og = require('ogconfig.js');

// Checks the parent to see if it exists or has been deleted deleted
var checkParentId = function(res, store, pid) {
  var parentId = 0;
  // gracefully handle parentId sent as string instead of number 
  if (typeof pid === "string") {
    parentId = parseInt(pid, 10);
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
    res.send("concept '" + parentId + "' (parent) not found");
    return null;
  }
  if(parentConcept.isDeleted) {
    res.setStatusCode(410);
    res.send("concept '" + parentId + "' (parent) has been deleted.");
    return null;
  }

  return parentId; // Success
};

// Creates a concept document from a concept record
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
  delete c[og.childJoinName];
  delete c.classifiers;
  c.ontology = ontology;
  c.links = {};
  c.links.self = restf.url_for("concepts", c.$id, ontology);
  c.links.ontology = restf.url_for("ontologies", ontology);
  return c;
};

// Get all concepts in an ontology
exports.getConcepts = function(res, store) {
  var concepts = [];
  var c;
  var ii = 0;
  for (ii = 0; ii < store.length; ii++) {
    if (!store[ii].isDeleted) {
      c = conceptFromRecord(store[ii], store.name);
      concepts.push(c);
    }
  }
  res.send(concepts);
};

// Get a concept from an ontology by concept id
exports.getConcept = function(res, store, concept) {
  var c = conceptFromRecord(concept, store.name);
  res.send(c); 
};

// Create a concept
exports.createConcept = function(res, data, store, ontology) {
  var ii = 0;
  // init concept object
  var concept = {};
  concept.name = data.name;
  var now = new Date();
  concept.modified = now.toISOString();
  // parent
  var parentId = checkParentId(res, store, data.parentId);
  if(parentId === null) { return;}
  // set the join
  concept.parent = {$id: parentId};

  // keywords
  concept.keywords = data.keywords || "";

  var lopts = analytics.getLanguageOptions();
  var parentc = store[parentId];

 // Stopwords
  concept.stopwords = restf.stopwordsFromObj(data, lopts, parentc.stopwords);
  // Stemmer
  concept.stemmer = restf.stemmerFromObj(data, lopts, parentc.stemmer);

  // docs - an array of ids from parent
  var docs = data.docs || [];
  concept.docs = [];
  for(ii = 0; ii < docs.length; ii++) {
    concept.docs.push({$id: docs[ii]});
  }

  concept.isDeleted = false; // we just created it after all...
  
  var rec = stores.addToStore(res, store, "concept", concept);
  if(rec === null) { return; }

  var addedConcept = conceptFromRecord(rec, ontology);
  res.send(addedConcept);
};

// Edit a concept
exports.editConcept = function(res, concept, data, store) {
  // updates a to record are made by adding a {record: $id} obbject
  // with the properties to be changed
  var change = {"$id": concept.$id};
  var now = new Date();
  change.modified = now.toISOString();
  // name
  change.name = data.name || concept.name; 
  change.keywords = data.keywords || concept.keywords;

  var lopts = analytics.getLanguageOptions();

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
 
  // Check if concept is root, if not, allow change of parent
  if(concept.parent !== null) {
    // Change Parent ("Move")
    if(data.hasOwnProperty("parentId")) {
      if (data.parentId !== concept.parent.$id) {
        var parentId = checkParentId(res, store, data.parentId);
        if (parentId === null) { return; }
        // new parent is valid
        concept.delJoin('parent', store[concept.parent.$id]);
        concept.addJoin('parent', store[parentId]);
      } // end of check if parent id is different from current parent id
    } // end of check for parent id in data
  } // end of is root check

  // change concept
  concept = stores.addToStore(res, store, "concept", change);
  if(concept === null) { return; }

  var addedConcept = conceptFromRecord(concept, store.name);
  res.send(addedConcept);
};

exports.getSubConcepts = function(res, concept, store) {
  var ii = 0;
  var rSet = concept[og.childJoinName];
  var data = [];
  for(ii = 0; ii < rSet.length; ii++) {
    if(!rSet[ii].isDeleted) {
      data.push(conceptFromRecord(rSet[ii], store.name));
    }
  }
  res.send(data);
};

// Deletes a concept and ALL SUBCONCEPTS
exports.deleteConcept = function(res, concept, store) {
  if(concept.parentId === -1) {
    res.setStatusCode(400);
    res.send("Root concept can not be deleted");
    return;
  }

  var recursiveDelete = function(c) {
    var ii = 0;
    var now = new Date();
    var rSet = c[og.childJoinName];
    for(ii = 0; ii < rSet.length; ii++) {
      recursiveDelete(rSet[ii]);
    }
    var change = {"$id": c.$id};
    change.modified = now.toISOString();
    change.isDeleted = true;
    store.add(change);
  };
  recursiveDelete(concept);
  
  res.setStatusCode(204);
  res.send();
};

// Get the documents belonging to a given concept
exports.getConceptDocuments = function(req, res, concept, store) {
  // doc ids for concept
  var rSet = concept.docs; // concept documents
  var result;
  var docs;
  var ii = 0;
  var queryStr;

  var args = req.args || {};
  if(args.hasOwnProperty("query")) {
    queryStr = args.query[0];
    result = documents.query(rSet, queryStr, store);
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
    fullDocs = Boolean(args.full[0]);
  }
  if(fullDocs) {
    var pargs = restf.paginationArguments(req);
    docs = restf.paginatedDocuments(result, store.name,
                                    pargs.page, pargs.per_page,
                                    pargs.summarize); 
  }
  else {
    docs = [];
    for(ii = 0; ii < result.length; ii++) {
      docs.push(result[ii].$id);
    }
  }
  res.send(docs); 
};

// Sets which documents are in a concept (select/deselect)
exports.editConceptDocuments = function(res, docId, op, concept, store) {
  var ii = 0;
  if(op !== "add" && op !== "del") {
    res.setStatusCode(400);
    res.send("Invalid operation: " + op);
    return;
  }
  var docStore = stores.getDocStore(store);
  var doc = stores.requireRecord(res, docStore, "document", docId);

  // perform operation
  if(op === "add") {
    concept.addJoin("docs", doc);
  }
  else if(op === "del") {
    concept.delJoin("docs", doc);
  }
  else {
    res.setStatusCode(500);
    res.send("Operation not properly matched.");
    return;
  }
  var now = new Date();
  concept.modified = now.toISOString();
  store.add(concept);

  var rSet = concept.docs; // concept documents
  var docs = [];
  for(ii = 0; ii < rSet.length; ii++) {
    docs.push(rSet[ii].$id);
  }
  res.send(docs); 
};

//
exports.getKeywordSuggestions = function(res, args, concept) {
   // docs
  var rSet = concept.docs; // concept documents
  
  // Aggregate Keywords
  var numKeywords = restf.optionalInt(args, "numKeywords",
                                      og.DEFAULT_NUM_KEYWORDS);
  var get_keywords = [{name: 'keywords', type: 'keywords', 
                       field: og.docsFieldName}];
  var keywords = rSet.aggr(get_keywords[0]);
  var skeywords = keywords.keywords.map(function(k) { return k.keyword; });
  var rkey = {keywords: skeywords.slice(0, numKeywords).join(", ")};

  res.send(rkey); 
};

// Concept suggestion from search
exports.getConceptSuggestionFromQuery = function(res, parentc,  store, 
                                                 queryStr) {
  var ii, jj = 0;
  var docStore = stores.getDocStore(store);
  var query = {}; query.$from = docStore.name;
  query[og.docsFieldName] = queryStr;

  // doc ids for intercept
  var rSet = parentc.docs; // concept documents
  var docIds = [];
  for (jj = 0; jj < rSet.length; jj++) {
    docIds.push(rSet[jj].$id);
  }

  // perform search
  var result = qm.search(query); // search
 
  // filter by concept docs
  result.filterById(docIds);
  var docs = [];
  for(ii = 0; ii < result.length; ii++) {
    docs.push(result[ii].$id);
  }
  // Not Found - send "empty" object
  if(docs.length === 0) {
    res.send({isEmpty: true});
    return;
  }
  // Aggregate Keywords
  var get_keywords = [{name: 'keywords', type: 'keywords', 
                       field: og.docsFieldName}];
  var keywords = result.aggr(get_keywords[0]);

  // Create suggestion object
  var suggestion = {};
  var skeywords = keywords.keywords.map(function(k) { return k.keyword; });
  //suggestion.name = skeywords.slice(0,3).join(", ");
  suggestion.name = queryStr.join(" ");
  suggestion.keywords = skeywords.slice(0, 10).join(", ");
  suggestion.parentId = parentc.$id;
  suggestion.docs = docs;
  res.send(suggestion); 
};

// Clustering based concept suggestions
exports.getConceptSuggestionsByClustering = function(req, res, concept, store) {
  var suggestions = [];
  var docids = [];
  var keywords, get_keywords;
  var ii, jj = 0;
  var args = req.args || {};
  var lopts = analytics.getLanguageOptions();

  // Stopwords
  var stopwords = restf.stopwordsFromObj(args, lopts, concept.stopwords);
  // Stemmer
  var stemmer = restf.stemmerFromObj(args, lopts, concept.stemmer);
  // number of suggestion, iterations and keywords
  var numSuggest = restf.optionalInt(args, "numSuggest",
                                     og.DEFAULT_SUGGESTIONS);
  var numIter = restf.optionalInt(args, "numIter", og.DEFAULT_ITER);
  var numKeywords = restf.optionalInt(args, "numKeywords",
                                      og.DEFAULT_NUM_KEYWORDS);

  // Create Feature Space
  var docStore = stores.getDocStore(store);
  var conceptDocs = concept.docs;
  var ftrSpace = analytics.newFeatureSpace([{type: 'text',
                                             source: docStore.name,
                                             field: og.docsFieldName,
                                             stemmer: {type: stemmer},
                                             stopwords: stopwords,
                                             normalize: true}]);
  ftrSpace.updateRecords(conceptDocs);
  
  // Perform KMeans
  var KMeansParams = {k: numSuggest, maxIterations: numIter, randomSeed:1};
  var clusters = analytics.trainKMeans(ftrSpace, conceptDocs , KMeansParams);

  // Get Words
  get_keywords = [{name: 'keywords', type: 'keywords',
                   field: og.docsFieldName}];

  for(ii = 0; ii < clusters.length; ii++) {
    docids = [];
    keywords = clusters[ii].aggr(get_keywords[0]);
    for(jj = 0; jj < clusters[ii].length; jj++) {
      docids.push(clusters[ii][jj].$id);
    }
    suggestions.push({keywords: keywords, docs: docids});
  }
  suggestions = suggestions.map(function(s) {
    var suggestion = {};
    docids = [];
    var skeywords = s.keywords.keywords.map(function(k) { return k.keyword; });
    suggestion.name = skeywords.slice(0,3).join(", ");
    suggestion.keywords = skeywords.slice(0, numKeywords).join(", ");
    suggestion.parentId = concept.$id;
    suggestion.docs = s.docs;
    return suggestion;
  });
  res.send(suggestions); 
};
