/*
 * Create Ontology
 */
http.onRequest("", "POST", function (req, res) {
  console.say("OntoGen API - Create");
  req = req["$body"];
  console.say(JSON.stringify(req));
  var root = ontogen.loadField(req["storeName"], req["fieldName"],
                               req["stemmer"], req["stopwordList"]);
  
  return res.send(root);
});

http.onRequest("languageoptions", "GET", function (req, res) {
  console.say("OntoGen API - Language Options");
  
  res.send(ontogen.getLanguageOptions());
});

/*
 * Concepts
 */
/// Create
http.onRequest("concepts", "POST", function (req, res) {
  console.say("OntoGen API - Concept POST");
  console.say(JSON.stringify(req));

  // Add behavior for POST <id>?

  var body = req["$body"];
  var concept = ontogen.newConcept(body["name"], body["parentId"],
                                   body["keywords"], body["docs"]);
  res.send(concept);
});

/// Read
http.onRequest("concepts", "GET", function (req, res) {
  console.say("OntoGen API - Concept GET");

  if(req.hasOwnProperty("$param")) {
    var concept = ontogen.getConcept(parseInt(req["$param"]));
    res.send(concept);
  }
  else {
    var concepts = ontogen.getConcepts();
    res.send(concepts);
  }
});

/// Update - Edit
http.onRequest("concepts", "PATCH", function (req, res) {
  console.say("OntoGen API - Concept PATCH");

  if(req.hasOwnProperty("$param")) {
    conceptId = parseInt(req["$param"]);
    var body = req["$body"];
    console.say(JSON.stringify(body));
    if(body.hasOwnProperty("name")) {
      ontogen.setName(conceptId, body["name"]);
    }
    if(body.hasOwnProperty("keywords")) {
      ontogen.setKeywords(conceptId, body["keywords"]);
    }
  }
  // send response
  res.send(ontogen.getConcept(conceptId));
});

/// Update - REPLACE=Edit
http.onRequest("concepts", "PUT", function (req, res) {
  console.say("OntoGen API - Concept PUT");

  if(req.hasOwnProperty("$param")) {
    conceptId = parseInt(req["$param"]);
    var body = req["$body"];
    console.say(JSON.stringify(body));
    if(body.hasOwnProperty("name")) {
      console.say(body["name"]);
      ontogen.setName(conceptId, body["name"]);
    }
    if(body.hasOwnProperty("keywords")) {
      //console.say(body["keywords"]);
      ontogen.setKeywords(conceptId, body["keywords"]);
    }
  }
  res.send();
});

/// Delete
http.onRequest("concepts", "DELETE", function (req, res) {
  console.say("OntoGen API - Concept DELETE");

  if(req.hasOwnProperty("$param")) {
    var concept = ontogen.delConcept(req["$param"])
  }
  // @TODO return error
});


/*
 * Suggest
 */
http.onRequest("suggest", "GET", function (req, res) {
  console.say("OntoGen API - Suggest");
  console.say(JSON.stringify(req));
  var suggested = ontogen.suggestConcepts(parseInt(req["parentId"]),
                                          parseInt(req["numConcept"]),
                                          parseInt(req["maxIter"]),
                                          parseInt(req["numWords"]));

  res.send(suggested);
});

/*
var ParentId = 0;
var NumConcepts = 4; 
var MaxIter = 50;
var WordsPerConcept = 10;

//console.say(JSON.stringify(suggested));
//console.say(suggested[0]["suggestedWords"][0]);

/*
a = ontogen.newConcept("Hello");
b = ontogen.newConcept("World");

console.say(JSON.stringify(a));
console.say(JSON.stringify(b));
console.say(JSON.stringify(ontogen.getChildren(0)));

ontogen.delConcept(a["id"]);
ontogen.delConcept(b["id"]);
console.say(JSON.stringify(ontogen.getChildren(0)));
*/
//ontogen.newConceptFromCluster(suggested[0], suggested[0]["suggestedWords"][0]);
/*
var name = suggested[0]["suggestedWords"].slice(0, 3).join(",");
var keywords = suggested[0]["suggestedWords"];
var parentId = suggested[0]["parentId"];
var docs = suggested[0]["docs"];

var concept = ontogen.newConcept(name, parentid, keywords, docs);
console.say(JSON.stringify(ontogen.getChildren(0)));


suggested = ontogen.suggestConcepts(concept["id"], 2, MaxIter, WordsPerConcept);

console.say(JSON.stringify(suggested));
*/
