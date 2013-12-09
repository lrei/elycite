App.Views.OntologyView = Backbone.View.extend({
  id: "ontoview",
  className: "row",

  //template: Handlebars.templates['concepts-nested'],
  //template: Handlebars.templates['ontotree'],
  template: Handlebars.templates['ontoview'],
  actionBarTemplate: Handlebars.templates['actionbar'],
  suggestTemplate: Handlebars.templates['suggestmodal'],
  deleteTemplate: Handlebars.templates['deletemodal'],
  moveTemplate: Handlebars.templates['movemodal'],

  events: {
     "click #change-concept": "changeConcept",
     "click #new-concept": "newConcept",
     "click #suggest-concepts": "showSuggestConcepts",
     "click #suggest": "suggestConcepts",
     "click #add-suggested": "addSuggested",
     "click #move-concept": "showMoveConcept",
     "click #move-to-destination": "moveConcept",
     "click #delete-concept": "showDeleteConcept",
     "click #delete-all": "deleteConcept",
     "click #delete-move": "deleteMoveConcept"
  },

  initialize: function() {
    console.log("Views.OntologyView.init");
    this.rendered = false;
    if(App.State.concepts === undefined) {
      console.log("Views.OntologyView.init: no concepts");
      //App.State.concepts = new App.Collections.Concepts();
      //App.State.concepts.fetch(); 
    }
    else {
      //this.listenTo(App.State.concepts, "add", this.render);
      this.listenTo(App.State.concepts, "sync", this.render);
      this.listenTo(App.State.concepts, "change", this.render);
      this.listenTo(App.State.concepts, "add", this.render);
      this.listenTo(App.State.concepts, "remove", this.render);
      this.listenTo(App.State.concepts, "create", this.render);

      // Keep a "selected" concept, monitor for changes
      if(App.State.selectedConcept === undefined) {
          App.State.selectedConcept = new App.Models.Selected();
          App.Helpers.setSelectedConceptRoot();
      }
      this.listenTo(App.State.selectedConcept, "change", this.renderActionBar);
   }

    if(App.State.suggestions === undefined) {
      App.State.suggestions = new App.Collections.Concepts();
    }
    this.listenTo(App.State.suggestions, "add", this.renderSuggestTable);
    this.listenTo(App.State.suggestions, "remove", this.renderSuggestTable);
    this.listenTo(App.State.suggestions, "reset", this.renderSuggestTable);

    this.render();
  },

  
  render: function() {
    console.log("Views.OtologyView.render");
    if (typeof App.State.concepts === 'undefined') {
      console.log("Views.OntologyView.render: no concepts");
      return;
    }
    // build concept tree
    var root = App.State.concepts.findWhere({parentId: -1});
    if(typeof root !== 'undefined') {
      console.log("go");
      if(!this.rendered) {
        console.log("append ontoviz");
        $(this.el).appendTo('#main').html( this.template() );
        this.rendered = true;
      }
      this.renderActionBar();
      if(this.graph === undefined) {
        this.graph = new App.Views.OntoViz();
      }
      this.graph.render();
    }
    else {
      console.log("Views.OntologyView.render: no root node");
    }
  },

  renderActionBar: function() {
    console.log("App.Views.OntologyView.renderActionBar");
    $('#actionbar').empty();
    var conceptjs = App.Helpers.getSelectedConcept().toJSON();
    $('#actionbar').html( this.actionBarTemplate(conceptjs) );
    $('#input-name').tooltip();
    $('#input-keywords').tooltip();
  },

  changeConcept: function() {
    console.log("App.Views.OntoView.changeConcept");
    var name = $("input#input-name").val();
    var keywords = $("input#input-keywords").val();
    var concept = App.Helpers.getSelectedConcept();
    concept.set("name", name);
    concept.set("keywords", keywords);
    concept.save();
  },

  showSuggestConcepts: function() {
    console.log("App.Views.OntoView.showSuggestConcepts");
    if($('#modal-suggest').length) {
      $('#modal-suggest').remove();
    }
    var conceptjs = App.Helpers.getSelectedConcept().toJSON();
    $(this.el).append(this.suggestTemplate(conceptjs));
    $('#modal-suggest').modal('show');
  },

  renderSuggestTable: function() {
    console.log("App.Views.OntoView.renderSuggestTable");
      $('#suggestions-table').empty();
      $('#suggestions-table').
        append(Handlebars.templates.
                suggesttable({suggestions: App.State.suggestions.toJSON()}));
  },

  suggestConcepts: function() {
    console.log("App.Views.OntoView.SuggestConcepts");
    var n = $("input#input-number-suggestions").val();

    // callback that sets the suggestions
    var setSuggestions = function(res) {
      var lid = 0;
      res.map(function(c) {
        c.numDocs = c.docs.length; 
        c.keywords = c.keywords.join(", ");
        c.lid = lid++;
      });
      App.State.suggestions.reset(res);
    }; // end of callback
    
    var concept = App.Helpers.getSelectedConcept();
    App.API.suggestConcepts(concept, n, setSuggestions);
  },

  addSuggested: function(ev) {
    console.log("App.Views.OntoView.addSuggested");
    var lid = parseInt($(ev.currentTarget).attr("data-lid"));
    console.log("LID === " + lid);
    console.log(typeof lid);
    console.log(App.State.suggestions.findWhere({lid: lid}));
    App.State.concepts.create(App.State.suggestions.findWhere({lid: lid}).toJSON());
    App.State.suggestions.remove(App.State.suggestions.findWhere({lid: lid}));
  },

  showDeleteConcept: function() {
    console.log("App.Views.OntoView.showDeleteModal");
    var conceptjs = App.Helpers.getSelectedConcept().toJSON();
    var concepts = App.State.concepts.toJSON();

    // get a concept and his subconcepts
    var subconcepts = App.Helpers.filterConcept(conceptjs, concepts);
    subconcepts = subconcepts.concat(conceptjs);
    // remove subconcepts from possible destinations
    concepts = concepts.filter(function(x) { return subconcepts.indexOf(x) < 0;});
    // has children?
    conceptjs.hasChildren = App.State.concepts.findWhere({parentId: conceptjs.$id});
    // display
    $(this.el).append(this.deleteTemplate({concept:conceptjs, concepts:concepts}));
    $('#modal-delete').modal('show');
  },

  deleteConcept: function(ev) {
    console.log("App.Views.OntoView.deleteConcept");
    var cid = $(ev.currentTarget).data("cid");
    console.log("delete cid: " + cid);
    App.Helpers.setSelectedConceptRoot();
    App.State.concepts.findWhere({$id: cid}).destroy({silent:true});
    App.State.concepts.fetch();
    $('#modal-delete').modal('hide');
    $('#modal-delete').on('hidden.bs.modal', function (e) {
      $('#modal-delete').remove();
    });

  },

  deleteMoveConcept: function(ev) {
    console.log("App.Views.OntoView.deleteMoveConcept");
    var cid = $(ev.currentTarget).data("cid");
    var did = $("#picker-destination").find("option:selected").data("did");
    console.log("######### delete cid: " + cid + " move to: " + did);
    var concept = App.State.concepts.findWhere({$id: cid});

    // first change the parent for all subconcepts
    var sub = App.State.concepts.where({parentId: concept.get("$id")});
    sub.map(function(c) { 
      c.set("parentId", did, {silent:true}).save({silent:true});
    });
    // delete
    concept.destroy({silent:true});
    // set root as new selected concept
    App.Helpers.setSelectedConceptRoot({silent:true});
    // refresh from server
    App.State.concepts.fetch();
    $('#modal-delete').modal('hide');
    $('#modal-delete').on('hidden.bs.modal', function (e) {
      $('#modal-delete').remove();
    });

  },

  showMoveConcept: function() {
    console.log("App.Views.OntoView.showMoveModal");
    var conceptjs = App.Helpers.getSelectedConcept().toJSON();
    var concepts = App.State.concepts.toJSON();

    // get a concept and his subconcepts
    var subconcepts = App.Helpers.filterConcept(conceptjs, concepts);
    subconcepts = subconcepts.concat(conceptjs);
    // remove subconcepts from possible destinations
    concepts = concepts.filter(function(x) { return subconcepts.indexOf(x) < 0;});

    // display
    $(this.el).append(this.moveTemplate({concept:conceptjs, concepts:concepts}));
    $('#modal-move').modal('show');
  },

  moveConcept: function(ev) {
    console.log("App.Views.OntoView.moveConcept");
    // warning: no checks are performed here. there should be server side
    // checks to prevent a concept from being moved into a subconcept
    var cid = $(ev.currentTarget).data("cid");
    var did = $("#picker-destination").find("option:selected").data("did");
    App.State.concepts.findWhere({$id: cid}).set("parentId", did).save();
    $('#modal-move').modal('hide');
    $('#modal-move').on('hidden.bs.modal', function (e) {
      $('#modal-move').remove();
    });
  },

 
});
