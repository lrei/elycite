// Config, URLs, Default Options, etc

// (c) 2013-2014 Luis Rei, Josef Stefan Institute
// MIT License

// base url: http://host:port/baseUrl/
exports.baseUrl = "/elyciteapi/";
// qminer sandbox directory
exports.sandbox = "./sandbox/elyciteapi/";

// databse constants
exports.ontodb = "ontologies";
exports.childJoinName = "childOf";
exports.docsFieldName = "text";

// preprocessing and classifier defaults
exports.DEFAULT_STOPWORDS = "none";
exports.DEFAULT_STEMMER = "none";
exports.DEFAULT_SUGGESTIONS = 2;
exports.DEFAULT_ITER = 50;
exports.DEFAULT_NUM_KEYWORDS = 10;
exports.DOCS_SUMMARY_SIZE = 30;  // "summary" size when docs list is sent to client
exports.DOCS_DEFAULT_PAGE_SIZE = 300;  // default page size in docs list

