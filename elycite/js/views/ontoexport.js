App.Views.OntoExportView = Backbone.View.extend({
  // element to be created
  id:'ontoExport',
  className: "mainView",

  template: Handlebars.templates['ontoexport'],
  fieldPickertemplate: Handlebars.templates['fieldpicker'],
  errorTemplate: Handlebars.templates['erroralert'],

   events: {
     "click #onto-export" : "exportOntology",
     "change #ontology-picker": "changeOntology"
  },

  initialize: function() {
    console.log("Views.OntoExport.init");

    this.stores = new App.Collections.Stores();
    this.stores.fetch();
    this.listenTo(this.stores, "sync", this.fetchOntologies);
  },

  fetchOntologies: function() {
    console.log("Views.OntoExport.fetchOntologies");

    // check if there are any stores
    if(this.stores.length === 0) { // no, show warning
      console.log("Views.OntoNewView.render: no ontologies to export");
      if($('.alert').length > 0) {
        $('.alert').remove();
      }
      $('#main').prepend(this.errorTemplate());
      $('#emptyStoreList').show();
    }
    else {
      this.ontologies = new App.Collections.Ontologies();
      this.ontologies.fetch();
      this.listenTo(this.ontologies, "sync", this.render);
    }
  },
 
  render: function() {
    console.log("Views.OntoExportView.render");
    // check if there are any ontologies to export
    if(this.ontologies.length === 0) { // no, show warning
      console.log("Views.OntoNewView.render: no ontologies to export");

      if($('.alert').length > 0) {
        $('.alert').remove();
      }
      $('#main').prepend(this.errorTemplate());
      $('#emptyStoreList').show();  // @TODO CHANGE THIS
    }

    else { // yes, show load modal
      this.ontology = this.ontologies.at(0);
      var docStoreName = this.ontology.toJSON().docStore;
      var docStore = this.stores.findWhere({storeName: docStoreName}).toJSON();
      var fields = docStore.fields;
      
      var ontologies = this.ontologies.toJSON();
      $(this.el).appendTo('#main').html(this.template({ontologies: ontologies}));
      $('#ontology-export-form').append(this.fieldPickertemplate({fields: fields}));
      $('.selectpicker').selectpicker('render');
    }
  },

  changeOntology: function(ev) {
    console.log("Views.OntoExportView.changeOntology");

    var sel = $(ev.currentTarget).val();
    this.ontology = this.ontologies.findWhere({name: sel});
    var ontojs = this.ontology.toJSON();
    var docStoreName = ontojs.docStore;
    var docStore = this.stores.findWhere({storeName: docStoreName}).toJSON();
    var fields = docStore.fields;

    $('#field-picker > option').remove();
    for(ii = 0; ii < fields.length; ii++) {
      $('#field-picker').append("<option>" + fields[ii].fieldName + "</option>");
    }
    $('#field-picker').selectpicker('refresh');
  },

  exportOntology: function() {
    console.log("Views.OntoExportView.exportOntology");

    var selectedFields = $('#field-picker').val();
    var filename = $('#exportFileName').val();
    $('#onto-export').button('loading');
    console.log(this.ontology);

    if($('.alert').length > 0) {
        $('.alert').remove();
    }
    $('#main').prepend(this.errorTemplate());

    this.ontology.export(selectedFields, filename, function() {
      console.log("Views.OntoExportView.exportOntology.callback");

      $('#onto-export').button('reset');
      $('#exportFileCreated').show();
    }, function() {
      console.log("Views.OntoExportView.exportOntology.callbackFail");

      $('#onto-export').button('reset');
      $('#exportFileFailed').show();
    });
  }

});

