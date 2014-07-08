App.Collections.Stores = Backbone.Collection.extend({
  model: App.Models.Store,
  url: App.API.root + 'stores/',
 
  initialize: function() {
    console.log("Collections.Stores Init");
  }
});
