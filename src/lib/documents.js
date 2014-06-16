// Ontogen - Document Management Module

// (c) 2013-2014 Luis Rei, Josef Stefan Institute
// MIT License

var restf = require('restf.js');
var stores = require('stores.js');
var og = require('ogconfig.js');


// Creates a document document from a document record
var documentFromRecord = function(rec, ontology, summary) {
  var d = rec.toJSON();
  // only use one field
  for(var field in d) {
    // "summarize" it
    if(summary) {
      // dont think summary will be needed for other datatypes but
      // if it is, they can be added here
      if(typeof rec[field] === "string") {
        d[field] = rec[field].substring(0, og.DOCS_SUMMARY_SIZE);
      }
      else {
        d[field] = rec[field];
      }
    }
  }
  //d.ontology = ontology;
  d.links = {};
  d.links.self = restf.url_for("documents", d.$id, ontology);
  return d;
};

// Helper function for paginating documents from a doc store recSet
var paginatedDocuments = function(recSet, ontology, page, per_page,  
                                  summarize) {
  var ii = 0;
  // Get the documents
  var docs = [];
  // calculate start
  var start = page * per_page;
  // calculate end
  var end = page * per_page + per_page;
  if(end > recSet.length) {
    end = recSet.length;
  }
  for (ii = start; ii < end; ii++) {
    var d = documentFromRecord(recSet[ii], ontology, summarize);
    docs.push(d);
  }
  return docs;
};

// Get a list of documents for a given ontology. Returns summaries by default.
exports.getDocuments = function(req, res, store) {
  var docStore = stores.getDocStore(store);
  var pargs = restf.paginationArguments(req);
  var docs = paginatedDocuments(docStore.recs, store.name, pargs.page,
                                pargs.per_page, pargs.summarize);
  res.send(docs);
};

// Get a single document from an ontology by document id
exports.getDocument = function(res, store, ontology, docId) {
  var docStore = stores.getDocStore(store);
  var doc = stores.requireRecord(res, docStore, "document", docId);
  if(doc === null) { return; }
  
  var d = documentFromRecord(doc, ontology, false);
  res.send(d); 
};

 // Query a document record set
exports.query = function(rSet, queryStr, store) {
  var result = [];
  var docIds = [];
  var jj = 0;
  for (jj = 0; jj < rSet.length; jj++) {
    docIds.push(rSet[jj].$id);
  }
  var docStore = stores.getDocStore(store); 
  var query = {}; query.$from = docStore.name;
  query[og.docsFieldName] = queryStr;
  // perform search
  result = qm.search(query); // search
  // filter by concept docs
  result.filterById(docIds);
  return result;
};
