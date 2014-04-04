App.Collections.Classifiers = Backbone.Collection.extend({
  model: App.Models.Classifier,

  url: "/ontogenapi/classifiers/",
  
  initialize: function(models, options) {
    if(options) {
      if(options.hasOwnProperty("url")) {
        this.url = options.url;
      }
    }
  },
});
