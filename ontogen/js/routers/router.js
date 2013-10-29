App.Routers.Main = Backbone.Router.extend({
  initialize: function() {
    _.bindAll(this, 'ontoview');
  },
 
  routes: {
    ''                : 'index',
    'ontoview'        : 'ontoview',
    'ontonew'         : 'ontonew',
  },
 
  index: function() {
    console.log("Router.index");
    this.navigate('ontoview', {trigger: true, replace:true});
   },

  ontoview: function() {
    console.log("Router.ontoview");
    this.ontology_view = new App.Views.OntologyView();
    this.ontology_view.render();
  },

  ontonew: function() {
    console.log("Router.ontonew: New Ontology");
    this.load_view = new App.Views.OntoNewView();
  }
});
