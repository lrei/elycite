App.Models.Store = Backbone.Model.extend({
  idAttribute: 'storeName',
  urlRoot: App.API.root + 'stores/',

  url: function() {
    if(this.get('links')) { // model got url from server
      return this.get('links').self; 
    }
    if(this.get('url')) { // model inited with url
      return this.get('url');
    }
    if(this.get('storeName')) { // model inited with storeName
      // currently have to overwrite this because my routing function for qminer
      // requires '/' terminated
      return this.urlRoot + this.get('storeName') + '/';
    }
    console.log("UH UH");
    return this.urlRoot;
  },

  getTextFields: function() {
    var fields = this.get("fields");

    var textfields = fields.filter(function(f) {
      return f.valueType === "string";
    }).map(function(f) {
      return f.fieldName;
    });
    
    return textfields;
  }

});
