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
    suggestConcepts: function(args, async, callback) {
      $.ajax({
        type: "GET",
        url: "/ontogenapi/suggest/",
        async: async,
        data: args,
        dataType: "json",
        contentType: 'application/json'
      }).done(function(data) {
        console.log("API.suggestConcepts.done");
        console.log(data);
        if(typeof callback === 'function') {
          console.log("callback");
          callback(data);
        }
      });

    }
  }
};
