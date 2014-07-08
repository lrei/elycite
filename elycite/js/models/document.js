App.Models.Document = Backbone.Model.extend({
  idAttribute: "$id",
  full: false,

  url: function() {
    if(this.hasOwnProperty("id")) {
      return this.get("links").self;
    }
    return this.collection.url;
  },

fetchFull: function(options) {
    var opts = options || {};
    if(this.full) {
      if(opts.success) {
        opts.success();
      }
      return;
    }
    var self = this;
    var success = opts.success || null;
    opts.success = function(model, response, options) {
      self.full = true;
      if(success) {
        success(model, response, options);
      }
    };
    this.fetch(opts);
  }

});
