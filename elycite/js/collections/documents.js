App.Collections.Documents = Backbone.Collection.extend({
  model: App.Models.Document,
  
  finished: false,
  fetch_next: 0,
  used_n: -1,
  in_progress: false,

  initialize: function(models, options) {
    this.url = options.url || {};
  },


  nextSet: function(options) {
    if(this.finished) {
        return; // we got this
    }
    if(this.in_progress) {
      return;
    }
    options = options || {};
    if(options.url) { 
      this.url = options.url;
    }
    options.data = $.param({ page: this.fetch_next});
    options.remove = false;
    var self = this; this.in_progress = true;
    options.success = function(collection, data, options) {
      self.fetch_next += 1;
      if(data.length === 0) {
        self.finished = true;
      }
      else if(self.used_n < 0 && data.length > 0) {
        self.used_n = data.length;
      }
      else if(data.length < self.used_n) {
        self.finished = true;
      }
      self.in_progress = false;
    };
    this.fetch(options);
  }
});
