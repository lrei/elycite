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
  c.numDocs = rec.docs.length;
  delete c.docs;
  delete c[og.childJoinName];
  delete c.classifiers;
  c.ontology = ontology;
  c.links = {};
  c.links.self = restf.url_for("concepts", c.$id, ontology);
  c.links.ontology = restf.url_for("ontologies", ontology);
  return c;
};

// Get all concepts in an ontology store
var getConcepts = function(store) {
  var concepts = [];
  var c;
  var ii = 0;
  for (ii = 0; ii < store.length; ii++) {
    if (!store[ii].isDeleted) {
      c = conceptFromRecord(store[ii], store.name);
      concepts.push(c);
    }
  }
  return concepts;
};

// Get all concepts (representations) in an ontology - http response
exports.getConcepts = function(res, store) {
  var concepts = getConcepts(store);
  res.send(concepts);
};

// Get a concept from an ontology by concept id
exports.getConcept = function(res, store, concept) {
  var c = conceptFromRecord(concept, store.name);
  res.send(c); 
};

// Create export version of ontology
exports.exportConcepts = function(res, store, docFieldNames, filename) {
  // export version of concepts
  var concepts = [];
  var c;
  var ii = 0, kk = 0, jj = 0;

  var filepath = og.sandbox + filename + ".json";
  var fout = fs.openWrite(filepath);

  var recs = store.recs;
  console.log(recs.length);
  recs = recs.filter(function(r) { return !r.isDeleted; });
  console.log(recs.length);

  for (ii = 0; ii < recs.length; ii++) {
    console.log(ii + ": " + recs[ii].$id);
    // get concept representation
    c = conceptFromRecord(recs[ii], store.name);

    // only need part of the typical representation
    c = {id: c.$id, name: c.name, parentId: c.parentId };

    //export documents, do not export for root concept
    if(docFieldNames.length !== 0 && !isRoot(recs[ii])) {
      // add document array
      c.documents = [];
      var conceptDocs = store[ii].docs;
      c.documents = conceptDocs.map(function(doc) {
        // filter in fields
        var rdoc = {}; // reduced version
        for(kk = 0; kk < docFieldNames.length; kk++) {
          var fieldName = docFieldNames[kk];
          rdoc[fieldName] = doc[fieldName];
        }
        return rdoc;
      });
    }
    //concepts.push(c);
    fout.writeLine(JSON.stringify(c));
  }
  fout.close();
  console.log("finished");

  res.send({filepath: filepath});
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
  
  var rec = stores.createRecord(res, store, concept);
  if(!rec) { return; }
  var addedConcept = conceptFromRecord(rec, ontology);
  res.send(addedConcept);
};

var isRoot = function(concept) {
  if(!concept.parent) { return true; }
  return false;
};

// get ancestors, root not included
var getAncestors = function(concept, acc) {
  if(!acc) { acc = []; }
  
  if(isRoot(concept)) { return acc; }
  if(isRoot(concept.parent)) { return acc; }

  acc.push(concept.parent);
  return getAncestors(concept.parent, acc);
};

// get descendents, self included
var getDescendants = function(concept, acc) {
  var ii;
  if(!acc) { acc = []; }

  var children = concept[og.childJoinName] || [];
  for(ii = 0; ii < children.length; ii++) {
    if(!children[ii].isDeleted) {
      getDescendants(children[ii], acc);
    }
  }

  acc.push(concept);
};

// descents without self
var getDescendantsExclusive = function(concept, acc) {
  var ii;
  if(!acc) { acc = []; }

  var children = concept[og.childJoinName] || [];
  for(ii = 0; ii < children.length; ii++) {
    if(!children[ii].isDeleted) {
      getDescendants(children[ii], acc);
    }
  }
};

var changeParent = function(concept, newParentId, remove, store) {
  // new parent must be valid valid
  var ii = 0;
  var jj = 0;
  var kk = 0;
  var prevAncestors = [];
  var oldParent = concept.parent || null;
  if(oldParent != null) {
    getAncestors(concept, prevAncestors);
  }

  // change the join for the parent
  if(oldParent != null) {
    concept.delJoin('parent', store[concept.parent.$id]);
  }
  concept.addJoin('parent', store[newParentId]);

  // Ensure docs are in new ancestors
  var conceptDocs = concept.docs;
  var ancestors = [];
  getAncestors(concept, ancestors);
  var newAncestors = ancestors.filter(function(x) {
    return prevAncestors.indexOf(x) < 0;
  });
  var newAncestorIds = newAncestors.map(function(a) { return a.$id; });
  //console.log(JSON.stringify(newAncestorIds));

  for(ii = 0; ii < newAncestorIds.length; ii++) {
    //console.log("ancestor ii = " + ii + " id = " + newAncestorIds[ii]);
    var ancestor = store[newAncestorIds[ii]];
    //console.log("ancestor: " + JSON.stringify(ancestor.toJSON(false)));
    var ancestorDocs = ancestor.docs;
    //console.log("conceptDocs: " + conceptDocs.length);
    //console.log("ancestorDocs: " + ancestorDocs.length);
    var diffDocs = conceptDocs.setdiff(ancestorDocs);
    //console.log("diffDocs: " + diffDocs.length);
    for(docN = 0; docN < diffDocs.length; docN++) { // @TODO BATCH
      ancestor.addJoin("docs", diffDocs[docN]);
    }
  }
  var oldAncestors = prevAncestors.filter(function(x) {
      return ancestors.indexOf(x) < 0;
    });
  var oldAncestorIds = oldAncestors.map(function(a) { return a.$id; });
  //console.log("oldAncestors: " + JSON.stringify(oldAncestorIds));

  if(remove && oldAncestorIds.length > 0) {
    // ensure docs are removed from previous ancestors
    var relatives = [];
    getDescendantsExclusive(oldParent, relatives);
    var relativeIds = relatives.map(function(a) { return a.$id; });
    //console.log("relatives: " + JSON.stringify(relativeIds));
    var descendantDocs = null;
    for(jj = 0; jj < relativeIds.length; jj++) {
      var relative = store[relativeIds[jj]];
      if(jj === 0) {
        descendantDocs = relative.docs;
        continue;
      }
      descendantDocs = descendantDocs.setunion(relative.docs);
    }
    var remoDocs;
    if(descendantDocs) {
      remDocs = conceptDocs.setdiff(descendantDocs);
    }
    else {
      remDocs = conceptDocs;
    }
    //console.log("remDocs: " + remDocs.length + "; conceptDocs: " + conceptDocs.length);
    for(kk = 0; kk < oldAncestorIds.length; kk++) {
      var oldAncestor = store[oldAncestorIds[kk]];
      //console.log("oldAncestor: " + JSON.stringify(oldAncestor.toJSON(false)));
      var intersectDocs = remDocs.setintersect(oldAncestor.docs);
      //console.log("intersectDocs: " + intersectDocs.length);
      for(docN = 0; docN < intersectDocs.length; docN++) { // @TODO BATCH
        oldAncestor.delJoin("docs", intersectDocs[docN]);
      }
    }
  } // end of remove from oldAncestors (data.remove = true)
  return true;
};

// Edit a concept
exports.editConcept = function(res, concept, data, store) {
  // updates a to record are made by adding a {record: $id} obbject
  // with the properties to be changed
  var ii;
  var now = new Date();
  var modified = now.toISOString();


  var change = {"$id": concept.$id, isDeleted: false, modified: modified};
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
  if(!isRoot(concept)) {
    // Change Parent ("Move")
    if(data.hasOwnProperty("parentId")) {
      var currentParentId = concept.parent.$id || null;
      if (data.parentId !== currentParentId) {
        data.remove = true; // @TODO change this not hardcoded
        var newParentId = checkParentId(res, store, data.parentId);
        if (newParentId === null) { return null; }

        changeParent(concept, newParentId, data.remove, store);
      } // end of check if parent id is different from current parent id
    } // end of check for parent id in data
  } // end of is root check

  // change concept
  concept = stores.createRecord(res, store, change);
  if(!concept) { return; }

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
	console.log("yep, has query");
    queryStr = args.query[0];
    result = documents.query(rSet, queryStr, store);
  }
  else {
    // No Query
    result = rSet;
  } 

  console.log("reeees");
  console.log(result);
  
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
    //docs = restf.paginatedDocuments(result, store.name,
    // docs = documents.paginatedDocuments(result, store.name,
    //                                pargs.page, pargs.per_page,
    //                                pargs.summarize); 
	documents.getDocuments(req, res, store)
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

// Extract (get)l keywords internal function
exports.extractKeywords = function(rSet, fieldName, numKeywords, stopwords) {
  
  var keyword_params = {
                        name: 'keywords', type: 'keywords', 
                        field: fieldName,
                        stopwords: stopwords
                      };
  var get_keywords = [keyword_params];
                       
  var keywords = rSet.aggr(get_keywords[0]);
  var skeywords = keywords.keywords.map(function(k) { 
    return k.keyword.trim();
  });
  skeywords = skeywords.filter(function(k) {
    return k; // if k is not empty
  });
  return skeywords.slice(0, numKeywords);
};

// Get keyword suggestions
exports.getKeywordSuggestions = function(res, args, concept, fieldName) {
   // docs
  var rSet = concept.docs; // concept documents
  
  // Aggregate Keywords
  var numKeywords = restf.optionalInt(args, "numKeywords",
                                      og.DEFAULT_NUM_KEYWORDS);
  
  var kwords = exports.extractKeywords(rSet, fieldName, numKeywords,
                                       concept.stopwords);
  var rkey = {keywords: kwords.join(", ")};

  res.send(rkey); 
};

// Concept suggestion from search
exports.getConceptSuggestionFromQuery = function(res, parentc,  store, 
                                                 fieldName, queryStr, 
                                                 _stopwords) {
  var ii, jj = 0;
  var docStore = stores.getDocStore(store);
  console.log("query: " + docStore.name);
  var query = {}; query.$from = docStore.name;
  query[fieldName] = queryStr;
  
  // stopwords
  var stopwords = _stopwords || parentc.stopwords;
  // doc ids for intercept
  var rSet = parentc.docs; // concept documents
  var docIds = [];
  for (jj = 0; jj < rSet.length; jj++) {
    docIds.push(rSet[jj].$id);
  }

  // perform search
  console.log("go search: " + JSON.stringify(query));
  var result = qm.search(query); // search
  if(result === null) {
    res.setStatusCode(500);
    res.send();
    return;
  }
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
  var kwords = exports.extractKeywords(rSet, fieldName, 10, stopwords);
  var keywordStr = kwords.join(", ");

  // Create suggestion object
  var suggestion = {};
  //suggestion.name = skeywords.slice(0,3).join(", ");
  suggestion.name = queryStr.join(" ");
  suggestion.keywords = keywordStr;
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
  var parentId = concept.$id;

  // field name
  var fieldName = args.fieldName[0];

  // Stopwords
  var stopwords = restf.stopwordsFromObj(args, lopts, concept.stopwords);
  // Stemmer
  var stemmer = restf.stemmerFromObj(args, lopts, concept.stemmer);

  // number of suggestions (clusters)
  var numSuggest = restf.optionalInt(args, "numSuggest",
                                     og.DEFAULT_SUGGESTIONS);
  // number of iterations
  var numIter = restf.optionalInt(args, "numIter", og.DEFAULT_ITER);

  // number of keywords
  var numKeywords = restf.optionalInt(args, "numKeywords",
                                      og.DEFAULT_NUM_KEYWORDS);

  // Create Feature Space
  var docStore = stores.getDocStore(store);
  var conceptDocs = concept.docs;
  var ftrSpaceParams = {
                        type: 'text',
                        source: docStore.name,
                        field: fieldName,
                        tokenizer: {
                          type: 'simple',
                          stopwords: stopwords,
                          stemmer: {type: stemmer}
                        },
                        normalize: true
                       };
  console.say(JSON.stringify(ftrSpaceParams));
  var ftrSpace = analytics.newFeatureSpace([ftrSpaceParams]);
  ftrSpace.updateRecords(conceptDocs);
  
  // Perform KMeans
  var KMeansParams = {k: numSuggest, maxIterations: numIter, randomSeed:1};
  var clusters = analytics.trainKMeans(ftrSpace, conceptDocs , KMeansParams);

  // Get keywords and push docs to create pseudo-suggestion object
  for(ii = 0; ii < clusters.length; ii++) {
    docids = [];
    ks = exports.extractKeywords(clusters[ii], fieldName, numKeywords, 
                                 stopwords);
    for(jj = 0; jj < clusters[ii].length; jj++) {
      docids.push(clusters[ii][jj].$id);
    }
    suggestions.push({keywords: ks, docs: docids});
  }

  // the trick here is we save the concept as being deleted, than when the user
  // adds it, it is simply "undeleted" this is so we don't have to send the
  // the concept document ids to the client
  suggestions = suggestions.map(function(s) {
    var suggestion = {};
    suggestion.name = s.keywords.slice(0,3).join(", ");
    suggestion.keywords = s.keywords.slice(0, numKeywords).join(", ");
    suggestion.parent = {$id: parentId};
    suggestion.stopwords = stopwords;
    suggestion.stemmer = stemmer;
    suggestion.modified = new Date().toISOString();
    /*
     * tricks begin here
     */
    suggestion.isDeleted = true;
    var recId = store.add(suggestion);
    var rec = store[recId];

    // add the docs one at the time as there seems to be a bug
    // when adding very large arrays via store.add
    for (var aa = 0; aa < s.docs.length; aa++) {
      rec.addJoin("docs", docStore[s.docs[aa]]);
    }

    var suggestionConcept = conceptFromRecord(rec, store.name); 
    suggestionConcept.numDocs = s.docs.length;   // send this to the client
    delete suggestionConcept.isDeleted;          // dont send this to the client
    return suggestionConcept;
  });
 

  res.send(suggestions); 
};