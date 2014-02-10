App.Views.OntologyView = Backbone.View.extend({
  id: "ontoview",

  //template: Handlebars.templates['concepts-nested'],
  //template: Handlebars.templates['ontotree'],
  template: Handlebars.templates['ontoview'],
  actionBarTemplate: Handlebars.templates['actionbar'],
  suggestTemplate: Handlebars.templates['suggestmodal'],
  deleteTemplate: Handlebars.templates['deletemodal'],
  moveTemplate: Handlebars.templates['movemodal'],
  queryTemplate: Handlebars.templates['querymodal'],
  answerButtonsTemplate: Handlebars.templates['answerbuttons'],
  questionTemplate: Handlebars.templates['question'],
  documentsTemplate: Handlebars.templates['docsmodal'],

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
     "click #delete-move": "deleteMoveConcept",
     "click #vis-decrease": "decreaseVisualizationSize",
     "click #vis-increase": "increaseVisualizationSize",
     "click #query-concept": "showQueryModal",
     "click #make-query": "makeQuery",
     "click button.answer-question": "answerQuestion",
     "click button.cancel-question": "cancelAL",
     "click button.finish-question": "finishAL",
     "click #view-documents": "viewDocuments",
     "click a.doc-list-item": "selectDocument",
     "dblclick a.doc-list-item": "viewDocument",
     "change #visualization-picker": "changeVisualization"
  },

  initialize: function() {
    console.log("Views.OntologyView.init");
    this.rendered = false;
    if(typeof App.State.concepts === "undefined") {
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
      if(typeof App.State.selectedConcept === "undefined") {
          App.State.selectedConcept = new App.Models.Selected();
          App.Helpers.setSelectedConceptRoot();
      }
      this.listenTo(App.State.selectedConcept, "change", this.renderActionBar);
   }

    if(typeof App.State.suggestions === "undefined") {
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
      this.renderVisualization();
    }
    else {
      console.log("Views.OntologyView.render: no root node");
    }
  },

  renderVisualization: function() {
    if(this.graph === undefined) {
        this.graph = new App.Views.OntoViz();
      }
      this.graph.render();
  },

  changeVisualization: function(ev) {
    var val = $(ev.currentTarget).val();
    console.log("Change visualization to: " + val);
    App.State.VizOpts.set({"name": val});
  },

  renderActionBar: function() {
    console.log("App.Views.OntologyView.renderActionBar");
    // prepare template data
    var tdata = App.Helpers.getSelectedConcept().toJSON();
    tdata.visualizations = App.Config.VisualizationEnum;
    // render
    $('#actionbar').empty();
    $('#actionbar').html( this.actionBarTemplate(tdata) );
    $('#input-name').tooltip();
    $('#input-keywords').tooltip();
    if(typeof App.State.VizOpts !== 'undefined') {
      $('#visualization-picker').val(App.State.VizOpts.get("name"));
    }
    $('#visualization-picker').selectpicker('render');
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
    var concept = App.Helpers.getSelectedConcept();
    if(concept.isRoot()) {
      return;
    }
    var conceptjs = concept.toJSON();
    var concepts = App.State.concepts.toJSON();

    // get a concept and his subconcepts
    var subconcepts = App.Helpers.filterConcept(conceptjs, concepts);
    subconcepts = subconcepts.concat(conceptjs);
    // remove subconcepts from possible destinations
    concepts = concepts.filter(function(x) { return subconcepts.indexOf(x) < 0;});
    // has children?
    conceptjs.hasChildren = App.State.concepts.findWhere({parentId: conceptjs.$id});
    console.log(conceptjs.hasChildren);
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
    var concept = App.Helpers.getSelectedConcept();
    if(concept.isRoot()) {
      return;
    }
    var conceptjs = concept.toJSON();
    var concepts = App.State.concepts.toJSON();

    // get a concept and his subconcepts
    var subconcepts = App.Helpers.filterConcept(conceptjs, concepts);
    subconcepts = subconcepts.concat(conceptjs);
    // remove subconcepts from possible destinations
    concepts = concepts.filter(function(x) { return subconcepts.indexOf(x) < 0;});

    // remove if exists
    if($('#modal-move').length > 0) {
      $('#modal-move').remove();
    }
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

  newConcept: function() {
    var parentId = App.Helpers.getSelectedConcept().get("$id");
    App.State.concepts.create({name: "New Concept", parentId: parentId});
  },

  decreaseVisualizationSize: function() {
    var width = App.State.VizOpts.get("width") - 20;
    var height = App.State.VizOpts.get("height") - 20;
    App.State.VizOpts.set("width", width, {silent: true});
    App.State.VizOpts.set("height", height);
  },
  
  increaseVisualizationSize: function() {
    var width = App.State.VizOpts.get("width") + 20;
    var height = App.State.VizOpts.get("height") + 20;
    App.State.VizOpts.set("width", width, {silent: true});
    App.State.VizOpts.set("height", height);
  },

  showQueryModal: function() {
    console.log("App.Views.OntoView.showQueryModal");
    var conceptjs = App.Helpers.getSelectedConcept().toJSON();
    var concepts = App.State.concepts.toJSON();

    // remove if exists
    if($('#modal-query').length > 0) {
      $('#modal-query').remove();
    }
    // display
    $(this.el).append(this.queryTemplate({concept:conceptjs}));
    $('#modal-query').modal('show');
  },

  makeQuery: function(ev) {
    console.log("App.Views.OntoView.makeQuery");
    var queryText = $('#query-text').val();
    if (queryText.length < 1) {
      return;
    }
    // concept url
    var cid = $(ev.currentTarget).data("cid");
    var c = App.State.concepts.findWhere({$id: cid}).toJSON();
    // make query and set AL, make question = true
    App.State.currentAL = new App.Models.AL({parentId: c.$id, 
                                             ontology: c.ontology,
                                             query: queryText});
    this.listenTo(App.State.currentAL, "change", this.renderQuestion);
    App.State.currentAL.save();
  },

  renderQuestion: function() {
    console.log("App.Views.OntoView.renderQuestion");
    var question = App.State.currentAL.toJSON();
    console.log(question);
    // set title
    var cname = question.query.substring(0, 15);
    /*
    if (question.query.length > 15) {
      cname = question.query.substring(0, 12) + "...";
    }
    */
    var title = "Does this document belong to the concept " + cname;
    $("#modal-query-label").text(title);
    // Clear body
    $("#modal-query-main").empty();
    $("#modal-query-main").append(this.questionTemplate(question));
    $("#modal-query-footer").empty();
    $("#modal-query-footer").append(this.answerButtonsTemplate(question));
  },

  answerQuestion: function(ev) {
    console.log("App.Views.OntoView.answerQuestion");
    //var alid = $(ev.currentTarget).data("alid");
    var answer = Boolean($(ev.currentTarget).data("answer"));
    App.State.currentAL.save({answer: answer,
                              questionId: App.State.currentAL.get("questionId")},
                             {patch: true});
  },
  
  cancelAL: function() {
    console.log("App.Views.OntoView.cancelAL");
    if(App.State.currentAL) {
      App.State.currentAL.destroy();
    }
  },

  finishAL: function() {
    console.log("App.Views.OntoView.finishAL");
    if(!App.State.currentAL) {
      return;
    }
    var addConceptFromAL = function(data) {
      App.State.concepts.create(data);
      App.State.currentAL.destroy();
    };
    App.State.currentAL.getConcept(addConceptFromAL);
  },

  viewDocuments: function() {
    console.log("App.Views.OntoView.viewDocuments");
    var concept = App.Helpers.getSelectedConcept();
    var docsUrl = concept.get("links").ontology + "documents/";
    console.log(docsUrl);
    // remove if exists
    if($('#modal-docs').length > 0) {
        $('#modal-docs').remove();
    }
    var self = this;
    // Fetch initial batch of Documents if necessary
    if(typeof App.State.Documents === "undefined") {
      App.State.Documents = new App.Collections.Documents();
      App.State.Documents.fetch({url: docsUrl, async: false});
    }
    concept.getDocs(function() {
      var conceptjs = concept.toJSON();
      var docsjs = App.State.Documents.toJSON();
      // summarize (client side version)
      var summarize = function(val) {
        val.summary = val.text.substring(0, 30);
        return val;
      };
      docsjs = docsjs.map(summarize);
      // selected
      var setSelected = function(val) {
        if (concept.containsDocument(val.$id)) {
          val.selected = true;
        }
        else {
          val.selected = false;
        }
        return val;
      };
      docsjs = docsjs.map(setSelected);
      $(self.el).append(self.documentsTemplate({concept:conceptjs,
                                                docs:docsjs}));
      $('#docs-modal').modal('show');
    });
  },

  viewDocument: function(ev) {
    ev.preventDefault();
    console.log("view");
    var did = $(ev.currentTarget).data("did");
    // display
    console.log(did);
    // make silent request
    var doc = App.State.Documents.get(did);
    doc.fetch({success: function() { 
      $('#document-details').html(JSON.stringify(doc.toJSON()));
    console.log("got it");}});
  },

  selectDocument: function(ev) {
    ev.preventDefault();
    console.log("select");
    $(ev.currentTarget).toggleClass("active");
    var did = $(ev.currentTarget).data("did");
    
  }


});
