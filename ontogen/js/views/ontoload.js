App.Views.OntoLoadView = Backbone.View.extend({
  // element to be created
  id:'loadOnto',

  template: Handlebars.templates['ontoload'],

   events: {
     "click button.close": "removeModal",
     "click button#close": "removeModal",
     "click button#ontoLoad" : "loadOntology"
  },

  initialize: function() {
    console.log("Views.OntoLoad.init");
    _.bindAll(this, "render", "loadOntology", "removeModal" );

    this.ontologies = new App.Collections.Ontologies();
    this.ontologies.fetch();
    this.listenTo(this.ontologies, "add", this.render);
    this.listenTo(this.ontologies, "change", this.render);
  },
 
  render: function() {
    console.log("Views.OntoLoadView.render");
     $('#main').append(this.el);
    var ontologies = this.ontologies.toJSON();
    //this.$el.html(this.template(data));
    $(this.el).append( this.template({"ontologies":ontologies}) );
    $("#loadModal").modal('show');
    $('#onto-picker').selectpicker('render');
  },


  loadOntology: function(event) {
    console.log("Views.OntoLoadView.loadOntology");
    // get the store name
    var ontoName = $('#onto-picker').val();
    var ontology = this.ontologies.findWhere({name: ontoName}).toJSON();
    
    App.State.concepts = new App.Collections.Concepts([], {url: ontology.links.concepts});
    this.listenToOnce(App.State.concepts, "add", this.removeModal);
    App.State.concepts.fetch();

  },

  removeModal: function() {
    console.log("View.OntoLoadView.removeModal");
    $("#loadModal").modal('hide');
    var self = this;
    $('#loadModal').on('hidden.bs.modal', function () {
      $('#loadModal').remove();
      self.router = new App.Routers.Main();
      self.router.navigate("ontoview", {trigger: true});
      self.remove();
    });
  }

});
