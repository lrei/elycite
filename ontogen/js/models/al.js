App.Models.AL = Backbone.Model.extend({

  urlRoot: function() {
    return this.get("concept").url() + 'al/';
  },

  getConcept: function(callback_success, callback_err) {
     $.ajax({
      type: "POST",
      url: this.url() + '/',
    }).done(function(data) {
      if(typeof callback_success === 'function') {
        callback_success(data);
      }
    });
  }
});
