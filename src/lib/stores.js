// Ontogen - Store/Ontology Management Module

// (c) 2013-2014 Luis Rei, Josef Stefan Institute
// MIT License

var restf = require('restf.js');
var og = require('ogconfig.js');


// function for creating a RootConcept object/document
function RootConcept(docStore, swords, stmr) {
  var stopwords = swords || og.DEFAULT_STOPWORDS;
  var stemmer = stmr || og.DEFAULT_STEMMER;
  var ii = 0;
  var now = new Date();
  var concept = {
    name: "root",
    keywords: "",
    stopwords: stopwords,
    stemmer: stemmer,
    modified: now.toISOString(),
    parentId: -1,
    isDeleted: false
  };
  concept.docs = [];
  for(ii = 0; ii < docStore.length; ii++) {
    concept.docs.push({$id: docStore[ii].$id});
  }
  return concept;
}


// JS helpper function for identifying what type of object
// e.g. what_is(records) === "[object Array]"
var what = Object.prototype.toString;
var what_is = function(x) {
  return what.call(x);
};

// Creates the store that holds ontologies
var createOntogenStore = function(res) {
  // name: ontology name
  // docStore: associated document store name
  // classifierStore: associated classifier store name
  // isDeleted: self explenatory
  var storeDef = [{
    "name": og.ontodb,
    "fields":  [
      { "name": "name", "type": "string", "primary":true},
      { "name": "docStore", "type": "string", "primary":false},
      { "name": "classifierStore", "type": "string", "primary":false},
      { "name": "isDeleted", "type": "bool", "primary":false, "default":false}
    ],
    "keys": [
      {"field": "name", "type": "value"}
    ]
  }];
  qm.createStore(storeDef);
  // Successful?
  var store = qm.store(og.ontodb);
  if(store === null) {
    res.setStatusCode(500);
    res.send("Unable to create main ontology store.");
    return null;
  }
  return store;
};

// Initialize ontogen stores
var initMainStore = function(res) {
  var ontodb = qm.store(og.ontodb);
  if (ontodb === null) {
    return createOntogenStore(res);
  }
  return ontodb;
};

// Returns a list of ontologies (records) -- including deleted
var listOntologies = function(res) {
  var ii = 0;
  var ontodb = qm.store(og.ontodb);
  // if main store does not exist, create it
  if (ontodb === null) {
    ontodb = initMainStore(res);
  }
  // check for errors
  if (ontodb === null) { return; }
  // create return data
  var ontologies = [];
  for (ii = 0; ii < ontodb.length; ii++) {
    ontologies.push(ontodb[ii].toJSON());
  }
  return ontologies;
};

// Responds with a list ontology documents containing all existing ontologies
exports.listOntologies = function(res) {
  var ontologies = listOntologies();
  // filter deleted
  ontologies = ontologies.filter(function(o) {
    return o.isDeleted === false;
  });
  ontologies = ontologies.map(function(s) {
    s.links = {};
    s.links.self = restf.url_for("ontologies", s.name);
    s.links.concepts = restf.url_for("concepts", null, s.name);
    return s;
  });
  res.send(ontologies);
};

// Responds with a list of qminer stores as objects, exluding ontogen stores
exports.listStores = function(res) {
  var dataStores = qm.getStoreList();
  // remove ontology stores
  var os = listOntologies().map(function(s) {
    return s.name;
  });
  dataStores = dataStores.filter(function(s) {
    return os.indexOf(s.storeName) < 0;
  });
  // remove classifier stores
  var cs = listOntologies().map(function(s) {
    return s.classifierStore;
  });
  dataStores = dataStores.filter(function(s) {
    return cs.indexOf(s.storeName) < 0;
  });
  // remove main store
  dataStores = dataStores.filter(function(s) {
    return s.storeName !== og.ontodb;
  });

  // builddata store objects
  var rdata = dataStores.map(function(s) {
    s.links = {};
    s.links.self = restf.url_for("stores", s.storeName);
    return s;
  });
  res.send(rdata);
};

// Creates a qminer store, including schema from data, for normal data
exports.createStore = function(res, data) {
  var storeName = data.storeName;
  var records = data.records;
  var used_keys = [];
  var proto;
  if(what_is(records) !== "[object Array]") {
    res.setStatusCode(400);
    res.send("Records must be an array not " + what_is(records) + ".");
    return;
  }
  if(records.length === 0) {
    res.setStatusCode(400);
    res.send("Records array is empty.");
    return;
  }
  proto = records[0];
  if(what_is(proto) !== "[object Object]") { 
    res.setStatusCode(400);
    res.send("Records (array elements) must be JSON not " + what_is(proto) + ".");
    return;
  }
  // build datastore schema from first object
  // Only JS native JSON serializable types are supported at the moment:
  // Number (float), String, arrays of these, plus Boolean.
  // all numbers are assumed to be float, JS has only Number and there 
  // is reliable way to tell 1.0 apart from 1. In the interest of reliability
  // Number is always assumed to be float.
   var storeDef = [{
    "name": storeName,
    "fields":  []
  }];
  for (var key in proto) {
    var el = proto[key];
    switch(what_is(el)) {
    case "[object Number]":
      if(key === "id" || key === "$id") {
        storeDef[0].fields.push({name:key, type:"int", primary:true}); 
      }
      else {
        storeDef[0].fields.push({name:key, type:"float", primary:false}); 
      }
      used_keys.push(key);
      break;
    case "[object String]":
      storeDef[0].fields.push({name:key, type:"string", primary:false});
      used_keys.push(key);
      break;
    case "[object Boolean]":
      storeDef[0].fields.push({name:key, type:"bool", primary:false});
      used_keys.push(key);
      break;
    case "[object Array]":
      if(el.length === 0) { break; } // that's too bad @warning
      var first = el[0];
      switch(what_is(el)) {
        case "[object Number]":
          used_keys.push(key);
          storeDef[0].fields.push({name:key, type:"oftFltV", primary:false}); 
          break;
        case "[object String]":
          used_keys.push(key);
          storeDef[0].fields.push({name:key, type:"oftStrV", primary:false});
          break;
      } // end of array switch
      break; // explecitly break out of array case
    } // end of datatype switch
  } // end of for loop for each key in object

  // schema is ready, add it to database
  qm.createStore(storeDef);
  // Successful?
  var store = qm.store(storeName);
  if(store === null) {
    res.setStatusCode(500);
    res.send("Unable to create store.");
    return;
  }

  // ok we have our store, now lets add the records
  for(var ii = 0; ii < records.length; ii++) {
    var recVal = {};
    for(var kk = 0; kk < used_keys.length; kk++) {
      var keyname = used_keys[kk];
      recVal[keyname] = records[ii][keyname]; 
    }
    store.add(recVal);
  }

  // @TODO newsfeed, twitter
  // newsfeed: {username, password, timestamp, max}
  // will need a temporary resource until finished
  // how to mark finished?
  // for now, only allow {$id, text} stores
  
  var storeObj = qm.getStoreList().filter(function(store) {
    return store.storeName === storeName;
  })[0];

  res.setStatusCode(201);
  res.send(storeObj);
};

// Check if a store exists
// Handles error response and returns null on error. Otherwise returns the
// store object.
exports.requireExists = function(res, dataStoreName) {
var dataStore = qm.store(dataStoreName);
  if(dataStore === null) {
    res.setStatusCode(400);
    res.send("Data Store '" + dataStoreName + "' not found");
    return null;
  }
  return dataStore;
};

// Helper function for requiring a record to exist in a given store
exports.requireRecord = function(res, store, name, rid) {
  var r = store[rid];
  if(r === null) {
    res.setStatusCode(404);
    res.send(name + " '" + rid + "' not found");
    return null;
  }
  return r;
};

// Helper function for adding a record to a store
exports.addToStore = function(res, store, name, obj) {
  rid = store.add(obj);
  if(rid === null) {
    res.setStatusCode(500);
    res.send("Unable to add " + name + " to store.");
    return null;
  }
  return store[rid];
};


exports.createOntology = function(res, data) {
  var dataStore = exports.requireExists(res, data.dataStore);
  if(!dataStore) { return; }
  var ontologyName = data.ontologyName;

  // check if ontology already exists
  if(qm.store(ontologyName) !== null) {
    res.setStatusCode(409);
    res.send("An ontology with the specified name already exists");
    return;
  }

  var classifierStore = ontologyName + "_cls";
  var storeDef = [
  {
    "name": ontologyName,
    "fields":  [
      { "name": "name", "type": "string", "primary":true},
      { "name": "keywords", "type": "string", "primary":false},
      { "name": "stopwords", "type": "string", "primary":false},
      { "name": "stemmer", "type": "string", "primary":false},
      { "name": "modified", "type": "datetime" },
      { "name": "isDeleted", "type": "bool", "primary":false, "default":false}
    ],
    "keys": [
      {"field": "name", "type": "value"}
    ],
    "joins": [
      {"name" : "docs", "type" : "index",  "store" : dataStore.name},
      {"name": "parent", "type": "field", "inverse": og.childJoinName, "store": ontologyName},
      {"name": og.childJoinName, "type": "index", "store": ontologyName, "inverse" : "parent" },
      {"name": "classifiers", "type": "index", "store": classifierStore, "inverse" : "concept" }
    ]
  },
  { 
    "name": classifierStore,
    "fields":  [
      { "name": "name", "type": "string", "primary":true},
      { "name": "filepath", "type": "string", "primary":false},
      { "name": "type", "type": "string", "primary":false},
      { "name": "isDeleted", "type": "bool", "primary":false, "default":false},
      { "name": "modified", "type": "datetime" }
    ],
    "keys": [
      {"field": "name", "type": "value"}
    ],
    "joins": [
      {"name": "concept", "type": "field", "inverse": "classifiers", "store": ontologyName}
    ]
  }
  ];

  // create ontology
  qm.createStore(storeDef);
  // Successful?
  var s = qm.store(ontologyName);
  if(s === null) {
    res.setStatusCode(500);
    res.send("Unable to create ontology");
    return;
  }

  // add to main store
  var main = qm.store(og.ontodb);
  var nstore = {name: ontologyName,
                docStore: dataStore.name,
                classifierStore: classifierStore,
                isDeleted: false};
  main.add(nstore);

  // create root concept
  var swords = data.stopwordList || null;
  var stmr = data.stemmer || null;
  var root = new RootConcept(dataStore, swords, stmr);
  s.add(root);
  
  // build ontology object
  var onto = {name: s.name};
  onto.links = {
    "self": restf.url_for("ontologies", ontologyName),
    "concepts":  restf.url_for("concepts", null, ontologyName)
  };

  res.setStatusCode(201);
  res.send(onto);
};

// Gets an ontology record from the ontology store
var ontoRecordFromStore = function(store) {
  var recs = qm.store(og.ontodb).recs;
  recs.filterByField("name", store.name);
  return recs[0];
};

// Returns an ontology document from its store
exports.getOntology = function(res, store) {
  var ontoRec = ontoRecordFromStore(store);
  var onto = ontoRec.toJSON();
  // build ontology object
  onto.links = {
    "self": restf.url_for("ontologies", onto.name),
    "concepts":  restf.url_for("concepts", null, onto.name)
  };
  res.send(onto);
};

// Returns a document store from an ontology store
exports.getDocStore = function(store) {
  var ontoRec = ontoRecordFromStore(store);
  return qm.store(ontoRec.docStore);
};

// Returns a classifier store from an ontology store
exports.getClassifierStore = function(store) {
  var ontoRec = ontoRecordFromStore(store);
  return qm.store(ontoRec.classifierStore);
};
