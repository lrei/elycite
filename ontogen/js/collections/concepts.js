App.Collections.Concepts = Backbone.Collection.extend({
  model: App.Models.Concept,
  
  getRoot: function() {
    return this.findWhere({parentId: -1});
  }
});
