App.Models.Ontology = Backbone.Model.extend({
  idAttribute: 'name',

  url: function() {
    if(this.get(this.idAttribute)) {
      return this.collection.url + this.get(this.idAttribute) + '/';
    }
    return this.collection.url;
  },

  export: function(selectedFields, filename, callback) {
    console.log('ontology.export');
    var url = this.url() + 'export/';
      $.ajax({
        type: "GET",
        url: url,
        data: {fields: selectedFields, filename: filename}
      }).done(function() {
        console.log("ontology.export.done");
        if(typeof callback === 'function') {
          callback();
        }
      });
  }
});
