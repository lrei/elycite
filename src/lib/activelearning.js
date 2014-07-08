// Ontogen - Active Learning Module

// (c) 2013-2014 Luis Rei, Josef Stefan Institute
// MIT License

var analytics = require('analytics.js');
var restf = require('restf.js');
var stores = require('stores.js');
var og = require('ogconfig.js');

// very bad global AL table
var globalALTable = {};

// Generates a positive 32bit integer random value
var randomPosInt32 = function() {
  var max = 2147483647;
  var min = 0;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


// Get a question  from an AL
var getQuestionObj = function(AL, name, concept, ontology) {
  var ii = 0;
  var question = {};
  var conceptDocs = concept.docs;
  
  // Get new question
  var did = AL.selectQuestion();
  console.say("selectQuestion returned did = " + did);
  question.questionId = did;
  question.id = name; // this uses the AL id (no client side question obj)
  question.links = {};
  question.links.self = restf.url_for("al", name, ontology, concept.$id);

  // Document associated with Question
  var doc = conceptDocs[did];
  question.text = doc[og.docsFieldName];
  question.mode = !AL.getQueryMode();
  // get keywords if return mode = true
  if (!AL.getQueryMode()) {
    var keywords;
    var positives = AL.getPos();
    var positiveDocs = [];
    for (ii = 0; ii < positives.length; ii++) {
      positiveDocs.push(conceptDocs[positives[ii]].$id);
    }
    question.count = positives.length;
    question.docs = positiveDocs; // assign documents to concept
    // get keywords from concept docs
    var get_keywords = [{name: 'keywords', type: 'keywords',
                         field: og.docsFieldName}];

    if (positiveDocs.length > 0) {
      var posRecs = conceptDocs;
      posRecs.filterById(positiveDocs);
      keywords = posRecs.aggr(get_keywords[0]);
      keywords = keywords.keywords.map(function(k) { return k.keyword; });
    }
    question.name = keywords.slice(0,3).join(", ");
    question.keywords = keywords.slice(0, 10).join(", ");
  }
  return question;
};

// Add AL to table
var addToTable = function(AL, name) {
  globalALTable[name] = AL;
};

// Get AL from table
var getFromTable = function(name) {
  if(globalALTable.hasOwnProperty(name)) {
    return globalALTable[name];
  }
  return null;
};

// Remove AL from table
var removeFromTable = function(name) {
  delete globalALTable[name];
};

// Create an active learner
exports.create = function(res, data, concept, store, query) {
  var lopts = analytics.getLanguageOptions();
  // Stopwords
  var stopwords = restf.stopwordsFromObj(data, lopts, concept.stopwords);
  // Stemmer
  var stemmer = restf.stemmerFromObj(data, lopts, concept.stemmer);
  // name
  var name = query.split(" ").join("_") + "_" + randomPosInt32();
  name = restf.optional(data, "name", name, restf.isValidName);

  // Create Feature Space
  var docStore = stores.getDocStore(store);
  var conceptDocs = concept.docs;
  var ftrSpace = analytics.newFeatureSpace([{type: 'text',
                                            source: docStore.name,
                                            field: og.docsFieldName,
                                            stemmer: {type: stemmer},
                                            stopwords: stopwords}]);
  ftrSpace.updateRecords(conceptDocs);

  // Transform Query
  //var queryObj = {}; queryObj[og.docsFieldName] = query;
  //var transformedQuery = ftrSpace.extractStrings(queryObj)[0];
  var AL = new analytics.activeLearner(ftrSpace, og.docsFieldName, conceptDocs,
                                       2, 2, query, 1.0, 4.0);
  if(AL === undefined) { // this can't currently happen, i think
    res.setStatusCode(500);
    res.send("Unable to create active learner");
    return;
  }

  // get the question
  var question = getQuestionObj(AL, name, concept, store.name);
  // store AL
  addToTable(AL, name);

  res.setStatusCode(201);
  res.send(question);
};

// Get a question from an AL by AL name
exports.getQuestion = function(res, name, concept, ontology, qid) {
  // Load AL
  var AL = getFromTable(name);
  if(AL === null) {
    res.setStatusCode(404);
    res.send("Active Learner " + name + " not found");
    return null;
  }
  var question = getQuestionObj(AL, name, concept, ontology, qid); 

  res.send(question);
};

// Answer question from AL and get a new one
exports.answerQuestion = function(res, name, concept, ontology, qid, answer) {
  // Load AL
  var AL = getFromTable(name);
  if(AL === null) {
    res.setStatusCode(404);
    res.send("Active Learner Not Found");
    return;
  }

  var answerStr = answer ? 'y' : 'n';
  console.say("answer with did: " + qid + ": " + answerStr);
  // Answer Question
  AL.getAnswer(answerStr, qid);

  // Get New Question
  var question = getQuestionObj(AL, name, concept, ontology); 
  res.send(question);
};

// Cancel Active Learning
exports.cancel = function(res, name) {
  removeFromTable(name);
  res.setStatusCode(204);
  res.send();
};

// Finish active learning and create a concept
exports.finish = function(res, name, concept) {
  var ii = 0;

  var AL = getFromTable(name);
  if(AL === null) {
    res.setStatusCode(404);
    res.send("Active Learner Not Found");
    return;
  }

  // Build concept from positive records
  var positives = AL.getPos();

  if(positives === null) {
    console.say("AL not in return mode.");
    res.setStatusCode(400);
    res.send("Activel Learner was not ready to return results.");
    return;
  }

  // Associated documents
  var conceptDocs = concept.docs;

  // Create Suggestion Object
  var suggestion = {};
  suggestion.docs = [];
  for (ii = 0; ii < positives.length; ii++) {
    suggestion.docs.push(conceptDocs[positives[ii]].$id);
  }

  var get_keywords = [{name: 'keywords', type: 'keywords', 
                       field: og.docsFieldName}];
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
  suggestion.name = keywords.slice(0,3).join(", ");
  suggestion.keywords = keywords.slice(0, 10).join(", ");
  suggestion.parentId = concept.$id;
  
  res.send(suggestion);
};
