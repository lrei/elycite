App.Views.OntologyView = Backbone.View.extend({
  el: "#ontoview",
 
  //template: Handlebars.templates['concepts-nested'],
  template: Handlebars.templates['ontotree'],

   events: {
  },

  initialize: function() {
    console.log("Views.OntologyView.init");
    if (typeof App.State.concepts === 'undefined') {
      console.log("Views.OntologyView.init: no concepts");
      //App.State.concepts = new App.Collections.Concepts();
      //App.State.concepts.fetch();
    }
    else {
      //this.listenTo(App.State.concepts, "add", this.render);
      this.listenTo(App.State.concepts, "sync", this.render);
      this.listenTo(App.State.concepts, "remove", this.render);
    }
  },
 
  render: function() {
    console.log("Views.OtologyView.render");
    if (typeof App.State.concepts === 'undefined') {
      console.log("Views.OntologyView.render: no concepts");
      return;
    }
    // build concept tree
    var root = App.State.concepts.findWhere({parentId: -1});
    if(typeof root != 'undefined') {
      $("#ontoview").show();
      var graph = new App.Views.OntoViz();
      graph.render();
    }
    else {
      console.log("Views.OntologyView.render: no root node");
    }
  }
 
});
