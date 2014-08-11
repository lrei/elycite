App.Collections.Records = Backbone.Collection.extend({
  model: App.Models.Record,
  save: function (options) { // bulk save
    return Backbone.sync("create", this, options);
  }
});
