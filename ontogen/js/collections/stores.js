App.Collections.Stores = Backbone.Collection.extend({
  model: App.Models.Store,
  url: '/qm_stores',
 
  initialize: function() {
    console.log("Collections.Stores Init");
  }
});
