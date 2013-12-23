App.Models.AL = Backbone.Model.extend({
  urlRoot : '/ontogenapi/al/',

  getConcept: function(callback_success, callback_err) {
    if(!this.get("links")) {
      if(calback_err) {
        callback_err();
      }
      return null;
    }
    var links = this.get("links");
    if(!links.hasOwnProperty("concept")) {
      if(callback_err) {
        callback_err();
      }
      return null;
    }
    var conceptUrl = links.concept;
    $.ajax({
      type: "GET",
      url: conceptUrl
    }).done(function(data) {
      if(typeof callback_success === 'function') {
        callback_success(data);
      }
    });
  }
});
