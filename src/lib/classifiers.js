// elycite - Active Learning Module

// (c) 2013-2014 Luis Rei, Josef Stefan Institute
// MIT License

var analytics = require('analytics.js');
var restf = require('restf.js');
var stores = require('stores.js');
var og = require('ogconfig.js');


// Creates a classifier `document` from its name and associated ontology name
exports.classifierFromName = function(name, ontology) {
  var c = {"id": name};
  c.links = {};
  c.links.self = restf.url_for("classifiers", name, ontology);
  c.links.ontology = restf.url_for("ontologies", ontology);
  return c;
};

// Save a classifier to the classifier DB and to filesystem
var saveClassifier = function(classifier, concept, store) {
  // open output file
  var filepath = og.sandbox + classifier.name + ".dat";
  var fout = fs.openWrite(filepath);
  // save feature space
  classifier.ftrSpace.save(fout);
  // save classifier
  classifier.model.save(fout);
  // close outstream
  fout.close();
  // save to db
  var classifierStore = stores.getClassifierStore(store);
  var now = new Date();
  var recVal = {
    name: classifier.name,
    fieldName: classifier.fieldName,
    filepath: filepath, 
    concept: {$id: concept.$id},
    type: "svm",
    modified: now.toISOString()
  };
  var rec = classifierStore.add(recVal);
  if(rec === null) { return null; }
  // return
  return rec;
};

// Load a classifier from DB and filesystem
var loadClassifier = function(name, store) {
  var classifierStore = stores.getClassifierStore(store);
  var classifierRec = classifierStore.rec(name);
  // check if classifier has been deleted
  if(classifierRec.isDeleted) { return null; }

  // check if file exists
  var filepath = classifierRec.filepath;
  if(!fs.exists(filepath)) { return null; }
  // read feature space and model
  var fin = fs.openRead(filepath);
  var ftrSpace = analytics.loadFeatureSpace(fin);
  var cls = analytics.loadSvmModel(fin);

  var classifier = {
    name: classifierRec.name,
    model: cls,
    fieldName: classifierRec.fieldName,
    ftrSpace: ftrSpace
  };
  return classifier;
};

// Marks a classifier DB entry as deleted and removes the file
var deleteClassifier = function(name, store) {
  var classifierStore = stores.getClassifierStore(store);
  var classifierRec = classifierStore.rec(name);
  if (classifierRec === null) { return; }
  // delete file
  var filepath = classifierRec.filepath;
  if(fs.exists(filepath)) { 
    fs.del(filepath); 
  }
  // update record
  classifierRec.isDeleted = true;
  classifierStore.add(classifierRec);
};

// Classify a RecSet
var classifyRecs = function(svm, ftrSpace, recSet, threshold) {
  threshold = threshold || 0.0;
  var posIdxs = [];
  var recN;
  var svmMargin;
  var recsMat = ftrSpace.ftrSpColMat(recSet); //recSet feature matrix
  //recsMat.normalizeCols();
  for (recN = 0; recN < recSet.length; recN++) {
    svmMargin = svm.predict(recsMat[recN]);
    if(svmMargin >= threshold) {
      posIdxs.push(recN);
    }
  }
  return posIdxs;
};


// Create a classifier and save it to the classifiers db and filesystem
exports.create = function(res, data, concept, store) {
  var ii = 0;
  var X = la.newSpMat();
  var y = la.newVec();
  var posIds = [];
  // language preprocessing options
  var lopts = analytics.getLanguageOptions();
  // name
  var name = restf.optional(data, "name", concept.name, restf.isValidName);
  // field
  var fieldName = data.fieldName;
  // Stopwords
  var stopwords = restf.stopwordsFromObj(data, lopts, concept.stopwords);
  // Stemmer
  var stemmer = restf.stemmerFromObj(data, lopts, concept.stemmer);

  // get the concept documents (Pos ex)
  var posRecs = concept.docs;
  if(posRecs.length < 1) {
    res.setStatusCode(400);
    res.send("No positve examples found (i.e. no documents in concept).");
    return;
  }
  for(ii = 0; ii < posRecs.length; ii++) {
    posIds.push(posRecs[ii].$id);
  }
  // get all documents NOT in concept (Neg ex)
  var docStore = stores.getDocStore(store);
  var negRecs = docStore.recs;
  negRecs.deleteRecs(posRecs);
  if(negRecs.length < 1) {
    res.setStatusCode(400);
    res.send("No negative examples found (i.e. all documents are in concept).");
    return;
  }

  // get svm c parameter, default is 1.0
  var c = restf.optionalPosFloat(data, "c", 1.0);
  // get the svm j parameter, default is balanced
  var j = negRecs.length / posRecs.length;
  j = restf.optionalPosFloat(data, "j", j); 
  // SvmParam
  var SvmParam = {c:c, j:j, maxTime:1}; // should I add normalize:false ?

  // feature space
  var ftrSpace = analytics.newFeatureSpace([{type: 'text',
                                                source: docStore.name,
                                                field: fieldName,
                                                tokenizer: {
                                                  type: 'simple',
                                                  stopwords: stopwords,
                                                  stemmer: {type: stemmer}
                                                }
                                            }]);
  ftrSpace.updateRecords(docStore.recs); // neg + pos recs = all
  var recsMat = ftrSpace.ftrSpColMat(docStore.recs); //recSet feature matrix
  //recsMat.normalizeCols();
  for (ii = 0; ii < docStore.recs.length; ii++) {
    X.push(recsMat[ii]);
    if(posIds.indexOf(docStore.recs[ii].$id) >= 0) {
      y.push(1.0);
    }
    else {
      y.push(-1.0);
    }
  }

  // build and store classifier
  console.log("train classifier");
  var cls = analytics.trainSvmClassify(X, y, SvmParam);

  if(cls === undefined || cls === null) {
    res.setStatusCode(500);
    res.send("Unable to build this classifer.");
    return null;
  }
  // create classifier object
  var classifier = {
    name: name,
    fieldName: fieldName,
    ftrSpace: ftrSpace,
    model: cls
  };
  // save classifier
  var ret = saveClassifier(classifier, concept, store);
  if(ret === null) {
    res.setStatusCode(500);
    res.send("Unable to save classifier.");
    return null;
  }
  // return url for classifier
  var msg = exports.classifierFromName(name, store.name);
  res.setStatusCode(201);
  res.send(msg);
};

// Return a list of available classifiers for a given ontology
exports.list = function(res, store) {
  var clStore = stores.getClassifierStore(store);
  var classifiers = [];
  var rec, c;
  var ii = 0;
  for(ii = 0; ii < clStore.recs.length; ii++) {
    rec = clStore.recs[ii];
    if(rec.isDeleted) { continue; }
    c = exports.classifierFromName(rec.name, store.name);
    classifiers.push(c);
  }
  res.send(classifiers);
};

// Returns a list of all availbale classifiers (all ontologies)
exports.listAll = function(res) {
  var classifiers = [];
  var clStore, store, ontoRec, rec, c;
  var ii = 0;
  var ontoN = 0;
  var ontologies = qm.store(og.ontodb);
  for(ontoN = 0; ontoN < ontologies.length; ontoN++) {
    ontoRec = ontologies[ontoN];
    if(ontoRec.isDeleted) { continue; }
    clStore = qm.store(ontoRec.classifierStore);
    store = qm.store(ontoRec.name);
    for(ii = 0; ii < clStore.recs.length; ii++) {
      rec = clStore.recs[ii];
      if(rec.isDeleted) { continue; }
      c = exports.classifierFromName(rec.name, store.name);
      classifiers.push(c);
    }
  }
  res.send(classifiers);
};

// Classify an array of documents
exports.classify = function(res, mid, data, store) {
  var ii = 0;
  var results = [];
  var recVal, rec, x, y;
  var classifier = loadClassifier(mid, store);
  if(classifier === null) {
    res.setStatusCode(404);
    res.send("Model (classifier) not found: " + mid + ".");
    return;
  }
  var cls = classifier.model;
  var ftrSpace = classifier.ftrSpace;
  var docStore = stores.getDocStore(store);
  
  // classify loop
  for(ii = 0; ii < data.length; ii++) {
    recVal = {}; recVal[classifier.fieldName] = data[ii];
    rec = docStore.newRec(recVal);
    x = ftrSpace.ftrSpVec(rec);
    y = cls.predict(x);
    results.push(y);
  }
  res.send(results);
};

// Create subconcepts by using an existing binary classifier
exports.subConcepts = function(res, mid, threshold, concept, store) {
  var ii = 0;
  var suggestions = [];
  var keywords;
  console.say("loading classifier");
  var classifier = loadClassifier(mid, store);
  if(classifier === null) {
    res.setStatusCode(404);
    res.send("Model (classifier) not found: " + mid + ".");
    return;
  }
  var cls = classifier.model;
  var ftrSpace = classifier.ftrSpace;

  // Get documents for concept
  var conceptDocs = concept.docs;

  // Classify documents
  var posResults = [];
  var negResults = [];
  var posIdxs = classifyRecs(cls, ftrSpace, conceptDocs, threshold);
  for(ii = 0; ii < posIdxs.length; ii++) {
      posResults.push(conceptDocs[posIdxs[ii]].$id);
  }
  var posRecs = concept.docs;
  var negRecs = concept.docs;
  posRecs.filterById(posResults);
  negRecs.deleteRecs(posRecs);
  for(ii = 0; ii < negRecs.length; ii++) {
    negResults.push(negRecs[ii].$id);
  }
  var get_keywords = [{name: 'keywords', type: 'keywords',
                      field: og.docsFieldName}];

  if (posRecs.length > 0) {
    // Get keywords for positive concept
    keywords = posRecs.aggr(get_keywords[0]);
    // Prepare positive concept
    var posConcept = {docs: posResults};
    posConcept.keywords = keywords.keywords.map(function(k) { 
                                                  return k.keyword; 
                                                });
    posConcept.name = posConcept.keywords.slice(0,3).join(", ");
    posConcept.keywords = posConcept.keywords.slice(0, 10).join(", ");
    posConcept.parentId = concept.$id;
    posConcept.positive = true;
    suggestions.push(posConcept);
  }
  if (negRecs.length > 0) {
    // Get keywords for negative concept
    keywords = negRecs.aggr(get_keywords[0]);
    // Prepare negative concept
    var negConcept = {docs: negResults};
    negConcept.keywords = keywords.keywords.map(function(k) { 
                                                  return k.keyword;
                                                });
    negConcept.name = negConcept.keywords.slice(0,3).join(", ");
    negConcept.keywords = negConcept.keywords.slice(0, 10).join(", ");
    negConcept.parentId = concept.$id;
    negConcept.negative = true;
    suggestions.push(negConcept);
  }

  // return both positive and negative concept
  res.send(suggestions); 
};
