App = {
  Models: {},
  Views: {},
  Collections: {},
  Routers: {},
  State: {},

  init: function() {
    console.log("App Init");
    // Init State Variables
    
    // Register Handlebars Helpers
    Handlebars.registerPartial("conceptPartial", Handlebars.templates['ontotree']);

    // Start app routing
    App.router = new App.Routers.Main();
    Backbone.history.start();
    // Get language options
    App.API.getLanguageOptions();
  },

  Config: {
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
    }

  },

  API: {
    root: "/ontogenapi/",

    getLanguageOptions: function(callback) {
      $.ajax({
        url: "/ontogenapi/languageoptions"
      }).done(function(data) {
        App.State.LanguageOptions = data;
        console.log(App.State.LanguageOptions);
        if(typeof callback === 'function') {
          callback(data);
        }
      });
    },

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

    loadOntology: function(link, async) {
      var concepts = new App.Collections.Concepts([], {url: link});
      var isAsync = async || false;
      concepts.fetch({async: isAsync});
      App.State.concepts = concepts;
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
      //return data; // if sync
    }
  }
};
