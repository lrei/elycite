App.Views.OntologyView = Backbone.View.extend({
  el: "#ontoview",
 
  //template: Handlebars.templates['concepts-nested'],
  template: Handlebars.templates['ontotree'],

   events: {
     "click #deleteconcept": "showDelete",
     "click #keep-delete-confirm": "deleteConcept",
     "click #delete-confirm": "deleteConceptNoTransit",
     "click #submit-details": "submitDetails",
     "show.bs.collapse #concept-details" : "collapseHandler",
     "show.bs.collapse #concept-suggestions" : "collapseHandler",
     "show.bs.collapse #concept-relations" : "collapseHandler",
     "click #suggest": "suggestConcepts",
     "click #addSuggested": "addSuggested"
  },

  initialize: function() {
    console.log("Views.OntologyView.init");
    _.bindAll(this, "render", "selectConcept", "submitDetails");
    if (typeof App.State.concepts === 'undefined') {
      console.log("Views.OntologyView.init: no concepts");
      //App.State.concepts = new App.Collections.Concepts();
      //App.State.concepts.fetch();
    }
    else {
      //this.listenTo(App.State.concepts, "add", this.render);
      this.listenTo(App.State.concepts, "sync", this.render);
      this.listenTo(App.State.concepts, "remove", this.render);
    }
  },
 
  render: function() {
    console.log("Views.OtologyView.render");
    if (typeof App.State.concepts === 'undefined') {
      console.log("Views.OntologyView.render: no concepts");
      return;
    }
    // build concept tree
    var root = App.State.concepts.findWhere({parentId: -1});
    if(typeof root != 'undefined') {
      console.log("View.OntologyView.render: Tree Building");
      root = root.toJSON();
      console.log("View.OntologyView.render: root: " + JSON.stringify(root));
      var conceptTree = function buildTree(node) {
        var children  = App.State.concepts.where({parentId: node.$id});
        if(children.length !== 0) {
          // @TODO change this to children.map()
          node.children = _.map(children,
                                function(m) { return buildTree(m.toJSON()); });
        }
        return node;
      };
      var tree = conceptTree(root);
      App.State.tree = tree;
      // insert concept tree html
      var html = this.template(tree);
      $("#concept-tree > #treeroot").html(html);
      // make labels select but not check
      var that = this;
      $("#concept-tree label").click(function(event) {
        that.selectConcept(event);
        return false;
      });
      
      var conceptId = root.$id;
      if(App.State.selectedConcept) {
        conceptId = App.State.selectedConcept;
      }
      console.log("go renderProperties for " + root.$id);
      this.renderProperties(root.$id);
      $("#ontoview").show();
      var height = $("#concept-tree").height() + 200;
      var graph = new App.Views.OntoViz({height: height});
      graph.render();
    }
    else {
      console.log("Views.OntologyView.render: no root node");
    }
  },

  renderProperties: function(conceptId) {
    console.log("View.OntologyView.renderProperties: " + conceptId);
    var concept = App.State.concepts.get(conceptId).toJSON();
    console.log(concept);
    var template = Handlebars.templates['ontoproperties'];
    var html = template(concept);
    $("#concept-details").html(html);
    // reset suggestion table
    $("#suggestions-container").empty();
  },

  collapseHandler: function(event) {
    console.log("Collapsing siblings");
    $(event.currentTarget).siblings(".in").collapse('hide');
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
    // remove visual selection
    $("#concept-tree label").css("background-color", "");
    // get concept id from the label;s parent (li)
    var conceptId = $(event.currentTarget).parent().attr('data-conceptid');
    // set visual indicator in the list item (li)
    // @TODO this should somehow move into the css
    $(event.currentTarget).css("background-color", "#428bca");

    //event.stopPropagation(); // Stop event from firing for parent
    console.log("View.OntologyView.selectConcept: Selected conceptId = " + conceptId);
    
    // Set state
    App.State.selectedConcept = parseInt(conceptId);
    this.renderProperties(conceptId);
  },

  showDelete: function() {
    // @TODO check if concept has relations
    $("#delete-modal").modal({backdrop:"static"});
  },

  deleteConcept: function() {
    // which button was clicked?

    var conceptId = App.State.selectedConcept;
    console.log("View.OntologyView.deleteConcept: Selected conceptId = " + conceptId);
    var concept = App.State.concepts.get(conceptId);
    // Get parentId
    var parentId = concept.get("parentId");
    if(parentId < 0) {
      reuturn; // dont delete root
    }
    // Change Selection
    App.State.selectedConcept = parentId;
    // Delete concept
    concept.destroy({wait: true});
    // @TODO MOVE TO CALLBACK:
    App.State.concepts.remove(conceptId);
    // dismiss modal
    $("#delete-modal").modal('hide');
  },

  suggestConcepts: function(event) {
    var numConcepts = parseInt($("#numSuggest").val());
    var req = {parentId: App.State.selectedConcept, numConcept: numConcepts, maxIter: 50, numWords: 10};
    App.API.suggestConcepts(req, false, function(data) {
      for(var ii = 0; ii < data.length; ii++) {
        data[ii].lid = ii;
        data[ii].numDocs = data[ii].docs.length;
      }
      App.State.suggestions = data;
      // insert list into UI
      var template = Handlebars.templates['suggesttable'];
      var html = template({suggestions: App.State.suggestions});
      $("#suggestions-container").html(html);
    });

  },

  addSuggested: function(event) {
    var selected = $("#suggestions-container input:checked").map(function() {
      return parseInt($(this).val());
    }).get();
    if(selected.length == 0) {
      return;
    }

    console.log("Addind concepts: + " + selected.join(", "));
    
    selected.forEach(function(entry) {
      App.State.concepts.create(App.State.suggestions[entry], {wait: true});
      delete App.State.suggestions[entry];
    });
    console.log("Finished adding suggested");
  }
 
});
