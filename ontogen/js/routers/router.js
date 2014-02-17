App.Routers.Main = Backbone.Router.extend({
  initialize: function() {
  },
 
  routes: {
    ''                : 'index',
    'ontoview'        : 'ontoview',
    'ontonew'         : 'ontonew',
    'ontoload'        : 'ontoload',
    'export-viz'      : 'exportviz',
  },
 
  index: function() {
    console.log("Router.index");
    this.navigate('ontoview', {trigger: true, replace:true});
   },

  ontoview: function() {
    console.log("Router.ontoview");
    if(typeof this.ontology_view !== "undefined") {
      this.ontology_view.remove(); // for use with !==
    }
    this.ontology_view = new App.Views.OntologyView();  // for use with ===
    //this.ontology_view.render();
  },

  ontonew: function() {
    console.log("Router.ontonew: New Ontology");
    if(typeof this.new_view !== "undefined") {
      this.new_view.remove();
    }
    this.new_view = new App.Views.OntoNewView();
  },

  ontoload: function() {
    console.log("Router.ontonew: Load Ontology");
    if(typeof this.load_view !== "undefined") {
      this.load_view.remove();
    }
    this.load_view = new App.Views.OntoLoadView();
  }

});
