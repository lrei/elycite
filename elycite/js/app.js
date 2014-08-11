App = {
  Models: {},
  Views: {},
  Collections: {},
  Routers: {},
  State: {},
  // Constants:
  // - ajaxTimeout: global timeout for ajax requests in milliseconds
  // - uploadPart: used in views/storefromdata.js, determines number of recs to 
  //               upload to the server in each request (POST)
  // - uploadMaxRetries: used in views/storefromdata.js, number of times to
  //                     retry an upload 
  Constants: {
    ajaxTimeout: 120000,
    uploadPart: 10,
    uploadMaxRetries: 5
  },

  init: function() {
    console.log("App Init");
    // Init State Variables
    $.ajaxSetup({timeout:App.Constants.ajaxTimeout});

    // Register Handlebars Helpers
    Handlebars.registerPartial("conceptPartial", Handlebars.templates['ontotree']);

    // Start app routing
    App.router = new App.Routers.Main();
    Backbone.history.start();
    // Get language options
    App.API.getLanguageOptions();
  },

  Config: {
    // 0 is the default visualization, otherwise numbers are only used for
    // display ordering of option (e.g. in a picker).
    // Used in OntoView (ActionBar) and OntoVisualization
    VisualizationEnum: [
      "Basic Force",
      "Horizontal Tree",
      "Radial Tree"
    ]
  },

  Helpers: {
    // TODO: rename to getRootConceptId, move to collection
    getRootConcept: function() {
      return App.State.concepts.findWhere({parentId: -1}).get("$id");
    },
    // TODO add collection param, move to model selectedConcept
    getSelectedConcept: function() {
      var conceptId = App.State.selectedConcept.get("selected");
      return App.State.concepts.findWhere({$id: conceptId});
    },

    setSelectedConcept: function(cid, options) {
      App.State.selectedConcept.set("selected", cid, options);
    },

    setSelectedConceptRoot: function(options) {
      App.State.selectedConcept.set("selected", App.Helpers.getRootConcept(), options);
    },

    filterConcept: function(concept, concepts) {
      // get all subconcepts
      var filterParent = function(concept) {
        return function(element) { return element.parentId == concept.$id; };
      };
      var subconcepts = concepts.filter(filterParent(concept));
      // recursive part
      var ssc = [];
      for(var ii = 0; ii < subconcepts.length; ii++) {
        ssc = ssc.concat(App.Helpers.filterConcept(subconcepts[ii], concepts));
      }
      subconcepts = subconcepts.concat(ssc);
      // result
      return subconcepts;
    },

    // Upload Management

  },

  API: {
    root: "/elyciteapi/",

    getLanguageOptions: function(callback) {
      $.ajax({
        url: "/elyciteapi/languageoptions"
      }).done(function(data) {
        App.State.LanguageOptions = data;
        if(typeof callback === 'function') {
          callback(data);
        }
      });
    },

    // @deprecated
    ontoCreate: function(args, async, callback) {
      async = async || false;
      $.ajax({
        type: "POST",
        url: App.API.root + "ontologies/",
        async: async,
        data: JSON.stringify(args),
        dataType: "json",
        processData: "false",
        contentType: 'application/json'
      }).done(function(data, callback) {
        console.log("API.ontoCreate.done link:" + data.links.concepts);
        App.State.concepts = new App.Collections.Concepts([], {url: data.links.concepts});
        App.State.concepts.fetch({async: async});
        if(typeof callback === 'function') {
          callback(data);
        }
      });
    },
    // @deprecated
    loadOntology: function(link, async) {
      var concepts = new App.collections.concepts([], {url: link});
      var isasync = async || false;
      concepts.fetch({async: isasync});
      App.state.concepts = concepts;
    },

    // @TODO move this to concept model using link url
    suggestConcepts: function(concept, n, callback) {
      var url = concept.url() + '/suggest/';
      $.ajax({
        type: "GET",
        url: url,
        data: {"numSuggest": n }
      }).done(function(data) {
        console.log("API.suggestConcepts.done");
        if(typeof callback === 'function') {
          callback(data);
        }
      });
    },

    // @TODO move this to concept model using link url
    classifyConcept: function(concept, cls, callback) {
      var url = concept.url() + '/classify/' + cls + '/';
      $.ajax({
        type: "GET",
        url: url,
      }).done(function(data) {
        console.log("API.classifyConcept.done");
        if(typeof callback === 'function') {
          callback(data);
        }
      });
    },

    // Upload Management 
    uploadRecords: function(data, url, finishedUpload, canceledUpload) {
      console.log("App.API.uploadRecords");
      App.State.recordData = data;
      App.State.recordsUrl = url;
      App.State.uploadPart = App.Constants.uploadPart;
      App.State.uploadpos = 0;
      App.State.uploadRetry = 0;
      App.State.uploadFinished = finishedUpload;
      App.State.uploadCanceled = canceledUpload;

      App.API.doUploadRecords();
    },

    doUploadRecords: function() {
      var next = App.State.uploadpos + App.State.uploadPart;
      console.log("current pos=" + App.State.uploadpos + ", next=" + next);
      App.State.recordDiff = App.State.recordData.slice(App.State.uploadpos, next);
      //console.log(App.State.recordDiff );
      $.ajax({
        type: "POST",
        url: App.State.recordsUrl,
        data: App.State.recordDiff,
        dataType: "json",
        processData: "false",
        contentType: 'application/json'
      }).done(App.API.uploadSuccess).fail(App.API.uploadError);
    },

   uploadSuccess: function() {
      console.log("Upload Complete");
      App.State.uploadRetry = 0;
      App.State.uploadpos += App.State.uploadPart;

      if(App.State.uploadpos >= App.State.recordData.length) {
        console.log("Uploading finished");
        App.State.uploadFinished();
        return;
      }

      App.API.doUploadRecords();
    },

    uploadError: function(finished, error) {
      console.log("Upload Error");
      if(App.State.uploadRetry >= App.Constants.uploadMaxRetries) {
        console.log("Uploading canceled");
        App.State.uploadCanceled();
        return;
      }
      App.State.uploadRetry += 1;
      // Decrease Batch size
      App.State.uploadPart = Math.ceil(App.State.uploadPart / 2);
      App.API.doUploadRecords();
    }

  } // End of App.API
};
