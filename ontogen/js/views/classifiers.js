App.Views.ClassifierView = Backbone.View.extend({
  id: "clsview",
  className: "mainView",

  template: Handlebars.templates['classifiers'],
  tryClassifierTemplate: Handlebars.templates['tryclassifiermodal'],

   events: {
     "click #delete-cls": "deleteClassifier",
     "click #try-cls": "showTryClassifierModal",
     "click #do-try-cls": "classifyData",
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

  },

  showTryClassifierModal: function(ev) {
    console.log("App.Views.ClassifierView.showClassifyModal");
    if($('#modal-tryclassifier').length) {
      $('#modal-tryclassifier').remove();
    }
    var mid = $(ev.currentTarget).data("mid");
    var cls = this.classifiers.get(mid);

    $(this.el).append(this.tryClassifierTemplate(cls.toJSON()));
    $('#modal-tryclassifier').modal('show');
    $('#modal-tryclassifer').on('hidden.bs.modal', function (e) {
      $('#modal-tryclassifer').remove();
    });
  },

  classifyData: function(ev) {
    var tgt = $(ev.currentTarget);
    var mid = $(ev.currentTarget).data("mid");
    console.log(mid);
    var cls = this.classifiers.get(mid);

    var testdata = $("#tryclassifier-text").val();
    testdata = JSON.stringify([testdata]);  // call expects array

    // success callback
    var success = function(data) {
      console.log(data);
      if(data[0] >= 0) {
        $("#classification").html('<p class="bg-success text-center"><strong>POSITIVE</strong></p>');
        tgt.button('reset');
      }
      else {
        $("#classification").html('<p class="bg-danger text-center"><strong>NEGATIVE</strong></p>');
        tgt.button('reset');
      }
    };
    // error calbback
    var err = function() {

      tgt.button('reset');
    };

    // set loading status
    tgt.button('loading');
    // classify
    cls.classify(testdata, success, err);
  }
});

