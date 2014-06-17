App.Models.Classifier = Backbone.Model.extend({
  defaults: {
  },

  url: function() {
    if(this.hasOwnProperty("urlRoot")) {
      if(this.get("id") === "undefined") {
        return this.urlRoot + this.get("id") + "/";
      }
      return this.urlRoot;
    }
    return this.get("links").self;
  },

  classify: function(data, clbk, err) {
    var options = {
      type: "POST",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      url: this.url(),
      success: clbk,
      error: err,
      data: data
    };
    $.ajax(options);
  }

 });
