App.Views.StoreFromDataView = Backbone.View.extend({
  // element to be created
  id:'storeFromData',
  className: "mainView",

  template: Handlebars.templates['storefromdata'],
  fileListTemplate: Handlebars.templates['filelist'],
  errorTemplate: Handlebars.templates['erroralert'],

   events: {
     "click #storeCreate" : "createStore",
     "change #files"      : "filesSelected",
	 "change #filesUrl"    : "fileFromUrl"
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
    $(this.el).prepend(this.errorTemplate());
    $('.selectpicker').selectpicker('render');
  },

  filesSelected: function(evt) {
    this.URL = false;
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
    // check if files are csv
    if(files[0].type === "text/csv") {
      $('#typePicker').selectpicker('val', 'CSV');
    }
    this.files = files;
  },


  fileFromUrl: function(evt) {
    this.URL = true;
    console.log("Views.StoreFromDataView.select");
    var storeName = $("#inputStoreName").val().trim();
    if (storeName.length === 0) {
      $("#nameAlert").show();
      return;
    }
    this.storeName = storeName;
	$('#storeCreate').button('loading');
	
	url = $("#filesUrl").val().trim();
	if (url.length < 1) {
	  this.urlError();
	  return;
	}
	
	var self = this;
	$.ajax({
	  url: url,
	  success: function(data) {
	    $('#storeCreate').button('Create');
		console.log("URL has valid dataset");		
		var fileType = $("#typePicker").val();
		var parsedJSON;
		if(fileType === "CSV") {
			try {parsedJSON = $.csv.toObjects(data); }
			catch(e) {
			  $("#csvAlert").show();
			  self.error = true;
			  return;
			}
		}
		else parsedJSON = JSON.parse(data);
		self.data = parsedJSON;
		self.loaded()
	   },
	   error: this.urlError
	});
  },  
  
  urlError: function() {
	console.log("Invalid URL.");
    $('#storeCreate').button('reset');
	$('#urlAlert').show();
  },
  
  createStore: function(event) {
  	url = $("#filesUrl").val().trim();
	if (url.length > 0) {
	  this.fileFromUrl();
	  return;
	}
  
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
    $('#storeCreate').button('loading');

    // callback for when files are done being read
    this.readCounter = 0;
    this.data = [];
    this.error = false;
    var fileType = $("#typePicker").val();
    var self = this;
    var doneReading = function(e) {
      var text = e.target.result;
      var parsedJSON;
      if(fileType === "CSV") {
        try {
          parsedJSON = $.csv.toObjects(text);
        }
        catch(e) {
          $("#csvAlert").show();
          self.error = true;
          return;
        }
      }
      else { // ASSUME JSON
        parsedJSON = JSON.parse(text);
      }
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
    if(this.URL === false && this.readCounter != this.files.length) {
	  console.log("fail");
      return;
    }
    if(this.error) {
      $('#storeCreate').button('reset');
      return;
    }
	
    // we're done loading files so lets create the store
    // split records into arrays of len 10
    // send the first small array with the create
    console.log("Data loaded into memory");
    // splice removes the spliced elements from the array
    // in this case we dont want data to contain the initdata when we
    // upload the rest of it
    var initdata = this.data.splice(0, App.Constants.uploadPart);	
    var storeOptions = {name: this.storeName, records: initdata};
    this.store = new App.Models.Store(storeOptions);
    this.listenToOnce(this.store, "sync", this.storeCreated);
    this.listenToOnce(this.store, "error", this.createError);

    this.store.save({error:this.createError});
  },

  createError: function(model, xhr, options) {
    console.log("Create error");
    $('#storeCreate').button('reset');
    $("#createAlert").show();
  },

  storeCreated: function(model, res, opts) {
    console.log("Store Created");

    $('#storeCreate').button('reset');
    $("#createdAlert").show();

    var storejs = model.toJSON();
    console.log("records url: " + storejs.links.records);

    var canceledUpload = function() {
      console.log("Upload Canceled");
      $("#createdAlert").hide();
      $("#uploadFailed").show();
      $('#storeCreate').button('reset');
    };

    var finishedUpload = function() {
      console.log("Uploading Finished"); 
      $("#createdAlert").hide();
      $("#uploadComplete").show();
      $('#storeCreate').button('reset');
    };
    var data = this.data;
    var url = storejs.links.records;
    App.API.uploadRecords(data, url, finishedUpload, canceledUpload);
  },

  
});
