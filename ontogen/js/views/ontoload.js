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
    $("#loadModal").modal({backdrop:"static"});
  },


  loadOntology: function(event) {
    console.log("Views.OntoLoadView.loadOntology");
    // get the store name
    var ontoName = $('#ontoPicker').val();
    var ontology = this.ontologies.findWhere({name: ontoName}).toJSON();
    // !!! Synchronous call -> modal will only be dismissed after the function
    // completes - this is so ontoview can have the new ontology loaded in
    App.API.loadOntology(ontology.links.concepts);
    
    // remove the modal
    this.removeModal();
  },

  removeModal: function() {
    console.log("View.OntoLoadView.removeModal");
    $("#loadModal").modal('hide');
    $('#loadModal').on('hidden.bs.modal', function () {
      this.remove();
      window.history.back();
    });
  }

});
