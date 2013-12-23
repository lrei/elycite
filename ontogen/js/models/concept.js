App.Models.Concept = Backbone.Model.extend({
  idAttribute: "$id",

  isRoot: function() {
    return this.get("parentId") === -1;
  }
});
