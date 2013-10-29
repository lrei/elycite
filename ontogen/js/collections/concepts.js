App.Collections.Concepts = Backbone.Collection.extend({
  model: App.Models.Concept,
  url: '/ontogenapi/concepts',
 
  initialize: function() {
    console.log("Collections.Concepts Init");
  },

});
