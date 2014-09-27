App.Routers.Main = Backbone.Router.extend({
  initialize: function() {
  },
 
  routes: {
    ''                : 'index',
    'ontoview'        : 'ontoview',
    'ontonew'         : 'ontonew',
    'ontoload'        : 'ontoload',
    'export'          : 'ontoexport',
    'export-viz'      : 'exportviz',
    'classifiers'     : 'classifiers',
    'storefromdata'   : 'storeFromData'
  },

  removeMainViews: function() {
    // main views are full page views, not modals, they need to be removed
    // before a new main view can be created.
    if(typeof this.ontology_view !== "undefined") {
      this.ontology_view.remove(); // for use with !==
    }
    if(typeof this.cls_view !== "undefined") {
      this.cls_view.remove();
    }
    if(typeof this.storefromdata_view !== "undefined") {
      this.storefromdata_view.remove();
    }

    if(typeof this.new_view !== "undefined") {
        this.new_view.remove();
    }

    if(typeof this.export_view !== "undefined") {
        this.export_view.remove();
    }
  },
 
  index: function() {
    console.log("Router.index");
    this.navigate('ontoview', {trigger: true, replace:true});
   },

  ontoview: function() {
    console.log("Router.ontoview");
    this.removeMainViews();
    this.ontology_view = new App.Views.OntologyView();  // for use with ===
    //this.ontology_view.render();
  },

  ontonew: function() {
    console.log("Router.ontonew: New Ontology");
    this.removeMainViews();
    this.new_view = new App.Views.OntoNewView();
  },

  ontoload: function() {
    console.log("Router.ontonew: Load Ontology");
    if(typeof this.load_view !== "undefined") {
      this.load_view.remove();
    }
    this.load_view = new App.Views.OntoLoadView();
  },

  ontoexport: function() {
    console.log("Router.ontonew: Export Ontology");
    this.removeMainViews();
    if(typeof this.export_view !== "undefined") {
      this.export.remove();
    }
    this.export_view = new App.Views.OntoExportView();
  },

  classifiers: function() {
    console.log("Router.classifiers");
    this.removeMainViews();
    this.cls_view = new App.Views.ClassifierView();
  },

  storeFromData: function() {
    console.log("Router.storeFromData");
    this.removeMainViews();
    this.storefromdata_view = new App.Views.StoreFromDataView();
  }

});
