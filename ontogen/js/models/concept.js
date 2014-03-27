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

  setDoc: function(docId, callback) {
    var docsUrl = this.url() + "docs/";
    var docList = this.get("docList");
    var self = this;
    var clbk = callback;
    var idx = docList.indexOf(docId);
    var options = {
      type: "PATCH",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      url: docsUrl
    };
    // is selected already?
    if (idx > -1) {
      // remove
      docList.splice(idx, 1);
      options.success = function() {
          self.set({docList: docList}, {silent: true});
          if(clbk) { clbk(); }
      };
      options.data = JSON.stringify({operation: "del", docId: docId});
    }
    else {
      // add
      docList.push(docId);
      options.success = function() {
          self.set({docList: docList}, {silent: true});
          if(clbk) { clbk(); }
      };
      options.data = JSON.stringify({operation: "add", docId: docId});
    }
    $.ajax(options);
  },

  getQuerySuggestion: function(query, callback) {
  var url = this.url() + "search/";
    $.ajax({
      type: "GET",
      url: url,
      data: {"query": query }
    }).done(function(data) {
      if(typeof callback === 'function') {
        callback(data);
      }
    });
  },

  getKeywordsSuggestion: function(callback) {
  var url = this.url() + "suggestkeywords/";
    $.ajax({
      type: "GET",
      url: url
    }).done(function(data) {
      if(typeof callback === 'function') {
        callback(data);
      }
    });
  },

  containsDocument: function(docId) {
    return this.get("docList").indexOf(docId) > -1;
  }
});
