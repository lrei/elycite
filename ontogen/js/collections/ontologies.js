App.Collections.Ontologies = Backbone.Collection.extend({
  model: App.Models.Ontology,
  url: App.API.root + 'ontologies/',
 
  initialize: function() {
    console.log("Collections.Ontologies Init");
  }
});
