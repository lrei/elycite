App.Models.Classifier = Backbone.Model.extend({
  defaults: {
  },

  url: function() {
    if(this.hasOwnProperty("urlRoot")) {
      if(typeof this.get("id") !== "undefined") {
        return this.urlRoot + this.get("id") + "/";
      }
      return this.urlRoot;
    }
    return this.get("links").self;
  }

 });
