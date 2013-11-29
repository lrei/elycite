App.Views.OntoNewView = Backbone.View.extend({
  // element to be created
  id:'newOnto',

  template: Handlebars.templates['ontonew'],

   events: {
     "click button#modalClose": "removeModal",
     "click button#close": "removeModal",
     "click button.ontoCreate" : "createOntology"
    //'click #load-data': 'loadData'
  },

  initialize: function() {
    console.log("Views.OntoNew.init");
    _.bindAll(this, "render", "createOntology", "removeModal" );


    if(typeof App.LanguageOptions === 'undefined') {
      App.API.getLanguageOptions();
    }
    this.stores = new App.Collections.Stores();
    this.stores.fetch();
    this.listenTo(this.stores, "add", this.render);
    this.listenTo(this.stores, "change", this.render);
  },
 
  render: function() {
    console.log("Views.OntoNewView.render");
     $('#main').append(this.el);
    var stores = this.stores.toJSON();
    for(var ii = 0; ii < stores.length; ii++) {
      stores[ii].langopts = App.State.LanguageOptions;
      var store = stores[ii];
      console.log(store.storeName);
      console.log(store.langopts);

    };
    //this.$el.html(this.template(data));
    $(this.el).append( this.template({"stores":stores}) );
    $("#newModal").modal({backdrop:"static"});
  },


  createOntology: function(event) {
    console.log("Views.OntoNewView.select");
    var ontoName = $("#inputOntoName").val().trim();
    if (ontoName.length === 0) {
      $("#nameAlert").show();
      return;
    }
    
    // get the store id
    var storeName = $(event.currentTarget).attr('data-storeName');
    console.log(storeName);
  
    var fieldName = $(event.currentTarget).parent().children().children("#fieldPicker-"+storeName).val();
    console.log(fieldName);

    // get the params
    var stemmer = $(event.currentTarget).parent().children().children("#stemmerPicker").val();
    console.log(stemmer);
    var maxNgramLength = $(event.currentTarget).parent().children().children("#maxNgramLength").val();
    console.log(maxNgramLength);
    var minNgramFreq = $(event.currentTarget).parent().children().children("#minNgramFreq").val();
    console.log(minNgramFreq);
    var stopwords = $(event.currentTarget).parent().children().children("#stopwordsPicker").val();
    console.log(stopwords);
    var customWordsFile = $(event.currentTarget).parent().children().children("#customWordsFile").val();
    console.log(customWordsFile);

    // Set global state?

    // make the request to qminer, show loading
    // !!! Synchronous call -> modal will only be dismissed after the function
    // completes - this is so ontoview can have the new ontology loaded in
    App.API.ontoCreate({ontologyName: ontoName,
      dataStore: storeName, fieldName: fieldName, stemmer: stemmer,
      maxNgramLength: maxNgramLength, minNgramFreq: minNgramFreq,
      stopwordList: stopwords
    }, false, function(data) {
      console.log(data);
    });
    // remove the modal
    this.removeModal();
  },

  removeModal: function() {
    console.log("View.OntoNewView.removeModal");
    $("#newModal").modal('hide');
    $('#newModal').on('hidden.bs.modal', function () {
      this.remove();
      window.history.back();
    })
  }

});
