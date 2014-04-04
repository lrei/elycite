App.Views.ClassifierView = Backbone.View.extend({
  id: "clsview",
  className: "mainView",

  template: Handlebars.templates['classifiers'],

   events: {
     "click #delete-cls": "deleteClassifier",
  },

  initialize: function() {
    console.log("Views.ClassifierView.init");

    this.classifiers = new App.Collections.Classifiers();
    this.listenToOnce(this.classifiers, "add", this.render);
    this.listenTo(this.classifiers, "remove", this.render);
    this.classifiers.fetch();
  },
 
  render: function() {
    console.log("Views.ClassifierView.render");
    $('#main').append(this.el);
    var classifiers = this.classifiers.toJSON();
    classifiers = classifiers.map(function(cls) {
      var o = cls.links.ontology.split("/");
      cls.ontology = o[o.length-2];
      cls.url =  cls.links.self;
      return cls;
    });
    $(this.el).html( this.template({classifiers:classifiers}) );
  },

  deleteClassifier: function(ev) {
    var mid = $(ev.currentTarget).data("mid");
    var cls = this.classifiers.get(mid);
    cls.destroy();

  }
});

