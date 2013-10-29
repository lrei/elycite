App.Views.OntologyView = Backbone.View.extend({
  el: "#ontoview",
 
  //template: Handlebars.templates['concepts-nested'],
  template: Handlebars.templates['ontotree'],

   events: {
     "click #concept-tree ul": "selectConcept",
     "click #submit-details": "submitDetails",
     "click #suggest-concepts": "suggestConcepts",
  },

  initialize: function() {
    console.log("Views.OntologyView.init");
    _.bindAll(this, "render", "selectConcept", "submitDetails");
    if (typeof App.State.concepts === 'undefined') {
      console.log("Views.OntologyView.init: no concepts");
      App.State.concepts = new App.Collections.Concepts();
      App.State.concepts.fetch();
    }
    //this.listenTo(App.State.concepts, "add", this.render);
    this.listenTo(App.State.concepts, "sync", this.render);
  },
 
  render: function() {
    console.log("Views.OtologyView.render");
    console.log(App.State.concepts);
    // build concept tree
    var root = App.State.concepts.where({parentId: -1});
    if(root.length != 0) {
      console.log("View.OntologyView.render: Tree Building");
      root = root[0].toJSON();
      var conceptTree = function buildTree(node) {
        var children  = App.State.concepts.where({parentId: node.id});
        if(children.length != 0) {
          node.children = _.map(children,
                                function(m) { return buildTree(m.toJSON()); });
        }
        return node;
      };
      var tree = conceptTree(root);
      console.log(JSON.stringify(tree));
      var html = this.template(tree);
      $("#concept-tree").html(html);
      console.log("go renderProperties for " + root["id"]);
      this.renderProperties(root["id"]);
      $("#ontoview").show();
    }
  },

  renderProperties: function(conceptId) {
    console.log("View.OntologyView.renderProperties: " + conceptId);
    var concept = App.State.concepts.get(conceptId).toJSON();
    console.log(concept);
    var template = Handlebars.templates['ontoproperties'];
    concept.keywordStr = concept["keywords"].join(", ");
    var html = template(concept);
    $("#concept-properties").html(html);
  },

  submitDetails: function(event) {
    var name = $(event.currentTarget).siblings().children("#input-name").val();
    var keywordStr = $(event.currentTarget).siblings().children("#input-keywords").val();
    var conceptId = $(event.currentTarget).attr("data-conceptId");
    var concept = App.State.concepts.get(conceptId);
    concept.set({name: name, keywords: keywordStr.split(", ")}, {patch: true});
    console.log(concept.isNew());
    concept.save();
  },

  selectConcept: function(event) {
    var conceptId = $(event.currentTarget).children().children("label").attr('data-conceptid');
    this.renderProperties(conceptId);
  },

  suggestConcepts: function(event) {
    var root = App.State.concepts.where({parentId: -1})[0].toJSON();
    var req = {parentId: parseInt(root["id"]), numConcept: 4, maxIter: 50, numWords: 10};
    var suggested = App.API.suggestConcepts(req, false, function(data) {
      console.log("add");
      for(var ii = 0; ii < data.length; ii++) {
        //delete data[ii].docs;
        App.State.concepts.create(data[ii]);
      }
    });
  }
 
});
