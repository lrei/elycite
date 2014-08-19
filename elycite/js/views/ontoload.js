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
    this.listenTo(this.ontologies, "sync", this.render);
  },
 
  render: function() {
    console.log("Views.OntoLoadView.render");
    $('#main').append(this.el);
    var ontologies = this.ontologies.toJSON();
    // check if there are any ontologies to load
    if(ontologies.length === 0) { // no, show warning
      console.log("Views.OntoLoadView.render: no ontologies to load");
      if($('.alert').length > 0) {
        $('.alert').remove();
      }
      $('#main').prepend(this.errorTemplate());
      $('#emptyOntologyList').show();
    }
    else { // yes, show load modal
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
    }
  },

  loadOntology: function(event) {
    console.log("Views.OntoLoadView.loadOntology");
    // set "loading" status for button
    $('#ontoLoad').button('loading');

    // get selected ontology
    var ontoName = $('#onto-picker').val();
    var ontology = this.ontologies.findWhere({name: ontoName});
    //set state
    App.Helpers.setState(ontology, this.removeModal, this.loadError);
 
    },

  loadError: function() {
    $('#ontoLoad').button('reset');
    $('#loadAlert').show();
  },

  removeModal: function() {
    console.log("View.OntoLoadView.removeModal");
    $('#ontoLoad').button('reset');
    $("#loadModal").modal('hide');
  }

});
