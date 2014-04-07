App.Views.StoreFromDataView = Backbone.View.extend({
  // element to be created
  id:'storeFromData',
  className: "mainView",

  template: Handlebars.templates['storefromdata'],
  fileListTemplate: Handlebars.templates['filelist'],

   events: {
     "click #storeCreate" : "createStore",
     "change #files"      : "filesSelected"
  },

  initialize: function() {
    console.log("Views.OntoNew.init");
    this.files = [];
    this.data = [];
    this.render();
  },
 
  render: function() {
    console.log("Views.StoreFromDataView.render");
    $(this.el).appendTo('#main').html( this.template());
  },

  filesSelected: function(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var fileDisplay = [];
    for (var ii = 0; ii < files.length ; ii++) {
      var f = files[ii];
      var ftype = f.type || 'n/a';
      var fdate = 'n/a';
      if(f.lastModifiedDate) {
        fdate = f.lastModifiedDate.toLocaleDateString();
      }
      var d = {name: f.name, type: ftype, size: f.size, lastModified: fdate};
      fileDisplay.push(d);
    }
    $("#list").html( this.fileListTemplate({files:fileDisplay}));
    this.files = files;
  },

  createStore: function(event) {
    console.log("Views.StoreFromDataView.select");
    var storeName = $("#inputStoreName").val().trim();
    if (storeName.length === 0) {
      $("#nameAlert").show();
      return;
    }
    this.storeName = storeName;
    if (this.files.length === 0) {
      $("#fileAlert").show();
      return;
    }

    // callback for when files are done being read
    this.readCounter = 0;
    this.data = [];
    var self = this;
    var doneReading = function(e) {
      var text = e.target.result;
      var parsedJSON = JSON.parse(text);
      self.data = self.data.concat(parsedJSON);
      self.readCounter++;
      self.loaded();
    };

    for(var ii = 0; ii < this.files.length; ii++) {
      var reader = new FileReader();
      reader.onload = doneReading;
      reader.readAsText(this.files[ii]);
    }
  },

  loaded: function() {
    //console.log(this.readCounter);
    if(this.readCounter != this.files.length) {
      return;
    }
    // we're done loading files so lets create the store
    var storeOptions = {storeName: this.storeName, records: this.data};
    var store = new App.Models.Store(storeOptions);
    this.listenToOnce(store, "change", this.storeCreated);
    store.save();
  },

  storeCreated: function() {
    $("#createdAlert").show();
  }

});
