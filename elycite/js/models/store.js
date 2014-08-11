App.Models.Store = Backbone.Model.extend({
  idAttribute: 'storeName',
  urlRoot: App.API.root + 'stores/',

});
