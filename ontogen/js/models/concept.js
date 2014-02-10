App.Models.Concept = Backbone.Model.extend({
  idAttribute: "$id",
  defaults: {
    docList: null,
  },

  isRoot: function() {
    return this.get("parentId") === -1;
  },

  url: function() {
    if(this.hasOwnProperty("id")) {
      console.log(this.id);
      return this.get("links").self;
    }
    console.log("NOOOOOOO");
    return this.collection.url;
  },

  getDocs: function(callback) {
    var docsUrl = this.url() + "docs/";
    var self = this;
    $.getJSON(docsUrl, function(data) {
      self.set({docList: data}, {silent: true});
      callback();
    });
  },

  containsDocument: function(docId) {
    return this.get("docList").indexOf(docId) > -1;
  }
});
