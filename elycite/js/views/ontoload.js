App.Views.OntoLoadView = Backbone.View.extend({
  // element to be created
  id:'loadOnto',

  template: Handlebars.templates['ontoload'],
  errorTemplate: Handlebars.templates['erroralert'],
  
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
    $('#loadModal').modal('show');
    $('#onto-picker').selectpicker('render');
    $('#load-body').prepend(this.errorTemplate());
    //install remove
    var self = this;
    $('#loadModal').on('hidden.bs.modal', function () {
      $('#loadModal').remove();
      self.remove();
      App.router.navigate("ontoview", {trigger: true});
    });
  },

  loadOntology: function(event) {
    console.log("Views.OntoLoadView.loadOntology");
    // get the store name
    var ontoName = $('#onto-picker').val();
    var ontology = this.ontologies.findWhere({name: ontoName}).toJSON();
    $('#ontoLoad').button('loading');
    if(typeof App.State.Documents !== 'undefined') { 
      delete App.State.Documents;
    }
    App.State.concepts = new App.Collections.Concepts([], {url: ontology.links.concepts});
    this.listenToOnce(App.State.concepts, "add", this.removeModal);
    App.State.concepts.fetch({error:this.loadError});
  },

  loadError: function(model, xhr, options) {
    $('#ontoLoad').button('reset');
    $('#loadAlert').show();
  },

  removeModal: function() {
    console.log("View.OntoLoadView.removeModal");
    $('#ontoLoad').button('reset');
    $("#loadModal").modal('hide');
    }

});
