App.Views.OntologyView = Backbone.View.extend({
  id: "ontoview",
  className: "mainView",

  //template: Handlebars.templates['concepts-nested'],
  //template: Handlebars.templates['ontotree'],
  template: Handlebars.templates['ontoview'],
  actionBarTemplate: Handlebars.templates['actionbar'],
  suggestTemplate: Handlebars.templates['suggestmodal'],
  deleteTemplate: Handlebars.templates['deletemodal'],
  moveTemplate: Handlebars.templates['movemodal'],
  queryTemplate: Handlebars.templates['querymodal'],
  answerButtonsTemplate: Handlebars.templates['answerbuttons'],
  queryResultButtonsTemplate: Handlebars.templates['queryresultbuttons'],
  questionTemplate: Handlebars.templates['question'],
  documentsTemplate: Handlebars.templates['docsmodal'],
  documentTemplate: Handlebars.templates['doctable'],
  doclistItemsTemplate: Handlebars.templates['doclistitems'],
  buildTemplate: Handlebars.templates['buildmodal'],
  classifyTemplate: Handlebars.templates['classifymodal'],

  events: {
     "click #change-concept": "changeConcept",
     "click #new-concept": "newConcept",
     "click #suggest-keywords": "suggestKeywords",
     "click #move-concept": "showMoveConcept",
     "click #move-to-destination": "moveConcept",
     "click #delete-concept": "showDeleteConcept",
     "click #delete-all": "deleteConcept",
     "click #delete-sub": "deleteSubConcepts",
     "click #delete-move": "deleteMoveConcept",
     "click #vis-decrease": "decreaseVisualizationSize",
     "click #vis-increase": "increaseVisualizationSize",
     "click #vis-download": "downloadVisualization",

     "click #suggest-concepts": "showSuggestConcepts",
     "click #suggest": "suggestConcepts",
     "click button.add-suggested": "addSuggested",
     "click button#add-suggested-all": "addSuggestedAll",

     "click button.query-concept": "showQueryModal",
     "click #make-query": "makeQuery",
     "click button.answer-question": "answerQuestion",
     "click button.cancel-question": "cancelAL",
     "click button.finish-question": "finishQuery",

     "click #view-documents": "viewDocuments",
     "dblclick a.doc-list-item": "selectDocument",
     "click a.doc-list-item": "viewDocument",
     "change #visualization-picker": "changeVisualization",

     "click #build-classifier": "showBuildClassifier",
     "click #do-build-cls": "buildClassifier",
     "click #classify-concept": "showClassify",
     "click #do-classify": "classifyConcept",
	 
	 "keyup #search-field": "ifEnterThensearchWordDocuments",
	 "click #search-word": "searchWordDocuments",	 
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
    tdata.textFields = App.State.docStore.getTextFields();
    // render
    $('#actionbar').empty();
    $('#actionbar').html( this.actionBarTemplate(tdata) );
    $('#input-name').tooltip();
    $('#input-keywords').tooltip();
    if(typeof App.State.VizOpts !== 'undefined') {
      $('#visualization-picker').val(App.State.VizOpts.get("name"));
    }
    $('#visualization-picker').selectpicker('render');
    $('#barFieldPicker').selectpicker('render');
  },

  changeConcept: function() {
    console.log("App.Views.OntoView.changeConcept");
    $('#change-concept').button('loading');
    var name = $("input#input-name").val();
    var keywords = $("input#input-keywords").val();
    var concept = App.Helpers.getSelectedConcept();
    concept.set("name", name, {silent:true});
    concept.set("keywords", keywords, {silent:true});

    var clbk = function() {  $('#change-concept').button('reset'); };

    concept.save([], {success:clbk, error:clbk});
  },

  showSuggestConcepts: function() {
    console.log("App.Views.OntoView.showSuggestConcepts");
    if($('#modal-suggest').length) {
      $('#modal-suggest').remove();
    }

    // setup modal
    var conceptjs = App.Helpers.getSelectedConcept().toJSON();
    var lopts = App.State.LanguageOptions;
    var textFields = App.State.docStore.getTextFields();
    $(this.el).append(this.suggestTemplate({
                                              concept: conceptjs, 
                                              textFields: textFields,
                                              langopts: lopts
                                            }));

    // show modal
    $('#modal-suggest').on('shown.bs.modal', function (e) {
      // when modal is shown, render the selectpicker
      $('.selectpicker').selectpicker('render');
    });
    $('#modal-suggest').modal('show');
    $('#modal-suggest').on('hidden.bs.modal', function (e) {
      $('#modal-suggest').remove();
    });
  },

  renderSuggestTable: function() {
    console.log("App.Views.OntoView.renderSuggestTable");
    $('#do-classify').button('reset');
    $('#suggestions-table').empty();
    $('#suggestions-table').append(Handlebars.templates.suggesttable(
          {suggestions: App.State.suggestions.toJSON()}));
  },

  suggestConcepts: function() {
    console.log("App.Views.OntoView.SuggestConcepts");

    // get input options
    var n = $("input#input-number-suggestions").val();
    var field = $("#fieldPicker").val();

    // advanced options
    var stopwords = $('#cls-stopwordsPicker').val();
    stopwords = stopwords || App.State.LanguageOptions.stopwords[0];
    var stemmer =  $('#cls-stemmerPicker').val();
    stemmer = stemmer || App.State.LanguageOptions.stemmer[0];

    var numIter = $("#numIter").val();
    var numKeywords = $("#numKeywords").val();
    var advanced_opts = {
                          numIter: numIter, 
                          stemmer: stemmer, 
                          stopwords: stopwords,
                          numKeywords: numKeywords
    };

    // set loading
    $('#suggest').button('loading');

    // define callback that sets the suggestions
    var setSuggestions = function(res) {
      var lid = 0;
      res.map(function(c) {
        c.lid = lid++;
      });
      App.State.suggestions.reset(res);

      // unset loading
      $('#suggest').button('reset');
    }; // end of callback
    
    // make call (get suggestions)
    var concept = App.Helpers.getSelectedConcept();
    App.API.suggestConcepts(concept, n, field, advanced_opts, setSuggestions);
  },

  addSuggested: function(ev) {
    console.log("App.Views.OntoView.addSuggested");
    var lid = parseInt($(ev.currentTarget).attr("data-lid"));
    $(ev.currentTarget).button('adding');
    console.log(App.State.suggestions.findWhere({lid: lid}));
    App.State.concepts.create(App.State.suggestions.findWhere({lid: lid}).toJSON());
    App.State.suggestions.remove(App.State.suggestions.findWhere({lid: lid}));
  },

  addSuggestedAll: function(ev) {
    console.log("App.Views.OntoView.addSuggestedAll");
    $(ev.currentTarget).button('adding');

    while(App.State.suggestions.length) {
      var suggestion = App.State.suggestions.pop().toJSON();
      if(App.State.suggestions.length === 0) {
        // last suggestion, trigger refreshes
        App.State.concepts.create(suggestion, {wait: true});
      }
      else {
        App.State.concepts.create(suggestion, {silent: true, wait: true});
      }
    }
  },

  showDeleteConcept: function() {
    console.log("App.Views.OntoView.showDeleteModal");
    var concept = App.Helpers.getSelectedConcept();
    if(concept.isRoot()) {
      return;
    }
    // remove if exists
    if($('#modal-delete').length > 0) {
      $('#modal-delete').remove();
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
    $('#delete-all').button('disabled');
    $('#delete-move').button('disabled');
    $(ev.currentTarget).button('loading');
    console.log("delete cid: " + cid);
    App.Helpers.setSelectedConceptRoot();
    App.State.concepts.findWhere({$id: cid}).destroy({wait: true});
    //App.State.concepts.findWhere({$id: cid}).destroy({silent:true});
    //App.State.concepts.fetch();
    $('#modal-delete').modal('hide');
    $('#modal-delete').on('hidden.bs.modal', function (e) {
      $('#modal-delete').remove();
    });
  },

  deleteSubConcepts: function(ev) {
    console.log("App.Views.OntoView.deleteSubConcepts");
    var cid = $(ev.currentTarget).data("cid");
    var did = $("#picker-destination").find("option:selected").data("did");
    var concept = App.State.concepts.findWhere({$id: cid});
    var sub = App.State.concepts.where({parentId: concept.get("$id")});
    // delete all in for loop, trigger on last
    for(var ii = 0; ii < sub.length; ii++) {
      if(ii != sub.length - 1) {
        sub[ii].destroy({silent:true, wait: true});
      }
      else {
        sub[ii].destroy({wait: true});
      }
    }
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
    concept.destroy({silent:true, wait:true});
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
    $(ev.currentTarget).button('loading');
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

  downloadVisualization: function() {
    var html = d3.select("svg")
        .attr("title", "test2")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

    var blob = new Blob([html], { type: "data:image/svg+xml" });
    saveAs(blob, "ontology.svg");
  },

  showQueryModal: function() {
    console.log("App.Views.OntoView.showQueryModal");

    var conceptjs = App.Helpers.getSelectedConcept().toJSON();
    var textFields = App.State.docStore.getTextFields();

    // remove if exists
    if($('#modal-query').length > 0) {
      $('#modal-query').remove();
    }
    // display
    $(this.el).append(this.queryTemplate({concept:conceptjs,
                                          textFields: textFields}));

    $('#modal-query').on('shown.bs.modal', function (e) {
      // when modal is shown, render the selectpicker
      $('#fieldPicker').selectpicker('render');
    });
    $('#modal-query').modal('show');
  },

  makeQuery: function(ev) {
    console.log("App.Views.OntoView.makeQuery");

    var queryText = $('#query-text').val();
    if (queryText.length < 1) {
      return;
    }

    // field to query
    var fieldName = $('#fieldPicker').val();
    console.log("fieldName: " + fieldName);

    // get current concept (parent of query)
    var cid = $(ev.currentTarget).data("cid");
    var c = App.State.concepts.findWhere({$id: cid});
    var queryType = $("#query-type").find("label.active").find("input").attr('id');
    $('#make-query').button('loading');
    
    switch(queryType) {
      case 'query-opt-simple':
        // Simple Query
        App.State.queryConcept = new App.Models.Concept();
        App.State.queryConcept.set("query", queryText);

        this.listenToOnce(App.State.queryConcept, "change", this.renderQueryResult);
        this.listenToOnce(App.State.queryConcept, "destroy", this.renderNoResults);

        var setQueryConcept = function(data) {
          if(typeof data === 'undefined' || data.hasOwnProperty('isEmpty')) {
            console.log("Data is empy/missing");
            App.State.queryConcept.destroy();
            return;
          }
          App.State.queryConcept.set(data);
        };
        c.getQuerySuggestion(queryText, fieldName, setQueryConcept);
        break;
      case 'query-opt-al':
        // Active Learner Query
        // make query and set AL, make question = true
        App.State.currentAL = new App.Models.AL({concept: c, 
                                                 query: queryText,
                                                 fieldName: fieldName});
        this.listenTo(App.State.currentAL, "change", this.renderQuestion);
        App.State.currentAL.save();
        break;
      case 'query-opt-gal':
        // Guided + Active Learner Query: Not Implemented yet
        $('#modal-query').modal('hide');
        App.State.GuidedDocuments = new App.Collections.Documents();
        
        break;
    }
  },

  renderQueryResult: function() {
    this.stopListening(App.State.queryConcept);
    var query = App.State.queryConcept.get("query");
    var title = "Concept for " + query;
    $("#modal-query-label").text(title);
    // Clear body
    $("#modal-query-main").empty();
    // concept suggested
    var suggested = App.State.queryConcept.toJSON();
    // make compatible with AL funcs
    suggested.id = -1; suggested.mode = true;
    suggested.count = suggested.docs.length;
    // append body template
    $("#modal-query-main").append(this.questionTemplate(suggested));
    $("#modal-query-footer").empty();
    $("#modal-query-footer").append(this.queryResultButtonsTemplate());
  },

  renderNoResults: function() {
    this.stopListening(App.State.queryConcept);
    $("#modal-query-main").empty();
    var query = App.State.queryConcept.get("query");
    $("#modal-query-label").text("No Results");
    $("#modal-query-main").text("No results found for query: " + query);
    $("#modal-query-footer").empty();
    $("#modal-query-footer").append(this.queryResultButtonsTemplate());
  },

  renderQuestion: function() {
    console.log("App.Views.OntoView.renderQuestion");
    var question = App.State.currentAL.toJSON();
    // set title
    var cname = question.query.substring(0, 15);
    /*
    if (question.query.length > 15) {
      cname = question.query.substring(0, 12) + "...";
    }
    */
    var title = "Does this document belong to the query " + cname;
    $("#modal-query-label").text(title);
    // Clear body
    $("#modal-query-main").empty();
    $("#modal-query-main").append(this.questionTemplate(question));
    $("#modal-query-footer").empty();
    $("#modal-query-footer").append(this.answerButtonsTemplate(question));
    // Enable buttons
    $('.answer-question').button('reset');
    $('.answer-question').prop('disabled', false);
    
  },

  answerQuestion: function(ev) {
    console.log("App.Views.OntoView.answerQuestion");
    var answer = $(ev.currentTarget).data("answer");
    $('.answer-question').prop('disabled', true);
    $(ev.currentTarget).button('loading');

    //var alid = $(ev.currentTarget).data("alid");
    answer = Boolean(answer);
    App.State.currentAL.save({answer: answer,
                              did: App.State.currentAL.get("questionId")},
                             {patch: true});
  },
  
  cancelAL: function() {
    console.log("App.Views.OntoView.cancelAL");
    if(App.State.currentAL) {
      App.State.currentAL.destroy();
    }
    if(App.State.queryConcept) {
      App.State.queryConcept.destroy();
    }
  },

  finishQuery: function(ev) {
    console.log("App.Views.OntoView.finishQuery");
    $(ev.currentTarget).button('loading');
    var alid = $(ev.currentTarget).data("alid");

    // check if simple query
    if(alid < 0 && App.State.queryConcept) {
      console.log("Simple Query");
      // add concept from simple query, cleanup first
      var conceptjs = App.State.queryConcept.toJSON();
      delete conceptjs.id; delete conceptjs.mode; delete conceptjs.query;
      delete conceptjs.count;
      App.State.concepts.create(conceptjs);
      App.State.queryConcept.destroy();
      return;
    }
    // ad concept from AL
    // make sure AL is available
    if(!App.State.currentAL) {
      return;
    }
    // add concept from al
    var addConceptFromAL = function(data) {
      console.log(data);
      App.State.concepts.create(data);
      App.State.currentAL.destroy();
    };
    App.State.currentAL.getConcept(addConceptFromAL);
  },

  showDocModal: function() {
	console.log("showDocModal");
  
    var concept = App.Helpers.getSelectedConcept();
	console.log(concept);
    var conceptjs = concept.toJSON();
	console.log(conceptjs);
	
    var self = this;
    concept.getDocs(function() {
      $(self.el).append(self.documentsTemplate({concept: conceptjs}));
      self.appendToDocList();
      $('#view-documents').button('reset');
      console.log("hey");
	  $('#docs-modal').modal('show');
      
      // bind events
      self.listenTo(App.State.Documents, 'sync', self.appendToDocList);
	  self.listenTo(App.State.Documents, 'reset', self.resetDocList);
      // bind scroll event because it does not bubble, must unbind on close
      $("#doclist").bind( "scroll", self.fetchMoreDocs);
      // unbind on hide (close)
      $('#docs-modal').on('hidden.bs.modal', function (e) {
        self.stopListening(App.State.Documents);
        $("#doclist").unbind( "scroll");
      });
    });
  },

  viewDocuments: function() {
    console.log("App.Views.OntoView.viewDocuments");
    var concept = App.Helpers.getSelectedConcept();
    var docsUrl = concept.get("links").ontology + "documents/"; // @TODO  // /elyciteapi/ontologies/onto_/documents/
	
    // remove if exists
    if($('#docs-modal').length > 0) {
        $('#docs-modal').remove();
    }
    $('#view-documents').button('loading');
    var self = this;
    // Fetch initial batch of Documents if necessary
    if(typeof App.State.Documents === "undefined") {
      App.State.Documents = new App.Collections.Documents([], {url: docsUrl});
      self.listenToOnce(App.State.Documents, 'add', self.showDocModal);
      App.State.Documents.fetch();
      return;
    }
    this.showDocModal();
  },
  
  viewDocuments2: function(docsjs) {
    console.log("App.Views.OntoView.viewDocuments2");
    var concept = App.Helpers.getSelectedConcept();
	var docsUrl = concept.get("links").ontology + "documents/";
    App.State.Documents.reset(docsjs);
  },

  prepareDocView: function(concept) {
	console.log("ontoview.prepareDocView");
    var docsjs = App.State.Documents.toJSON();
	console.log("docsjs length: " + docsjs.length);

    // remove the ones that were already in there
    var startPos = $('#doclist-items').children().length;
    docsjs = docsjs.slice(startPos);

    // set selected documents
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

    return docsjs; // view object
  },
  
  appendToDocList: function() {
    console.log("App.Views.OntologyView.appendToDocList");
    var concept = App.Helpers.getSelectedConcept();
    var docsjs = this.prepareDocView(concept);
    $('#doclist-items').append(this.doclistItemsTemplate({docs: docsjs}));
  },
  
  resetDocList: function() {
	$("#doclist-items").empty();  // clears the document list
	this.appendToDocList();  // appends i.e. prepares doc view
  },

  viewDocument: function(ev) {
    ev.preventDefault();
    var did = $(ev.currentTarget).data("did");
    // display
    // make silent request
    var doc = App.State.Documents.get(did);
    var self = this;
    doc.fetchFull({success: function() {
      var docjs = doc.toJSON();
      if('links' in docjs) {
        delete docjs.links;
      }
      $('#document-details').html(self.documentTemplate({document: docjs}));
    }});
  },

  selectDocument: function(ev) {
    ev.preventDefault();
    var elem = $(ev.currentTarget);
    var setSelected = function() {
      elem.toggleClass("active");
    };
    var did = $(ev.currentTarget).data("did");
    var concept = App.Helpers.getSelectedConcept();
    concept.setDoc(did, setSelected);
  },

  suggestKeywords: function() {
    var concept = App.Helpers.getSelectedConcept();
    var fieldName = $('#barFieldPicker').val();
    $('#suggest-keywords').button('loading');
    
    var setKeywords = function(data) {
      concept.set(data, {silent: true});
      var clbk = function() {
        $('#suggest-keywords').button('reset');
      };
      concept.save([],{success:clbk, error:clbk});
    };
    concept.getKeywordsSuggestion(fieldName, setKeywords);
  },

  fetchMoreDocs: function() {
    // do nothing if all documents have been fetched
    if(App.State.Documents.finished) {
      return;
    }
    var scrollHeight = $('#doclist')[0].scrollHeight;
    var scrollTop = $('#doclist').scrollTop();
    var outterHeight = $('#doclist').outerHeight();
    
    if(scrollTop < scrollHeight - outerHeight - 20) {
      return;
    }
    // otherwise fetch more
    // @TODO loading indicator
    App.State.Documents.nextSet();
  },

  showBuildClassifier: function() {
    var concept = App.Helpers.getSelectedConcept();

    // remove if exists
    if($('#modal-build').length > 0) {
      $('#modal-build').remove();
    }
    // display
    var self = this;
    var display = function() {
      var conceptjs = App.Helpers.getSelectedConcept().toJSON();
      conceptjs.ndocs = conceptjs.docList.length;
      var lopts = App.State.LanguageOptions;
      var textFields = App.State.docStore.getTextFields();
      $(self.el).append(self.buildTemplate({
                                              concept:conceptjs,
                                              langopts:lopts, 
                                              textFields:textFields
                                            }));
    $('#modal-build').on('shown.bs.modal', function (e) {
      // when modal is shown, render the selectpicker
      $('#fieldPicker').selectpicker('render');
    });
    $('#modal-build').modal('show');
      // set defaults
    $('#cls-stopwordsPicker').val(conceptjs.stopwords);
    $('#cls-stemmerPicker').val(conceptjs.stemmer);
    };
    concept.getDocs(display);
  },

  buildClassifier: function(ev) {
    var cid = $(ev.currentTarget).data("cid");
    $(ev.currentTarget).button('loading');
    var concept = App.State.concepts.findWhere({$id: cid});
    var classifiersUrl = concept.get("links").ontology + "classifiers/";
    // get options
    var name = $("#cls-name").val() || "default";
    var field = $("#fieldPicker").val();
    name = concept.get("ontology") + "_" + name;
    var stopwords = $('#cls-stopwordsPicker').val();
    var stemmer =  $('#cls-stemmerPicker').val();
    var c = parseInt($("#cls-param-c").val());
    var j = parseFloat($("#cls-param-j").val());
    var opts = {
      name:name,
      fieldName:field,
      cid:concept.id,
      c:c,
      j:j, 
      stemmer:stemmer,
      stopwords:stopwords
    };
    var classifier = new App.Models.Classifier(opts);
    classifier.urlRoot = classifiersUrl;
    classifier.save();
    this.listenToOnce(classifier, "change", this.closeBuildClassifier);
  },

  closeBuildClassifier: function() {
    $('#modal-build').modal('hide');
    $('#modal-build').on('hidden.bs.modal', function (e) {
      $('#modal-build').remove();
    });
  },

  showClassify: function() {
    console.log("App.Views.OntoView.showClassify");
    if($('#modal-classify').length) {
      $('#modal-classify').remove();
    }
    var conceptjs = App.Helpers.getSelectedConcept().toJSON();
    var self = this;
    // load available classifiers
    var clsUrl = conceptjs.links.ontology + "classifiers/";
    var classifiers = new App.Collections.Classifiers([], {url:clsUrl});
    this.listenToOnce(classifiers, 'add', function() {
      $(self.el).append(self.classifyTemplate({
        concept:conceptjs,
        classifiers:classifiers.toJSON()
      }));
      $('#modal-classify').modal('show');
      $('#classifierPicker').selectpicker('render');
      $('#modal-classify').on('hidden.bs.modal', function (e) {
        $('#modal-classify').remove();
      });
    });
    classifiers.fetch();
  },

  classifyConcept: function() {
    console.log("App.Views.OntoView.classifyConcept");
    var cls = $("#classifierPicker").val();
    $('#do-classify').button('loading');

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
    App.API.classifyConcept(concept, cls, setSuggestions);
  },
  
  ifEnterThensearchWordDocuments: function(ev) {
	if (ev.keyCode == 13) {
	  this.searchWordDocuments();
	}
  },
  
  searchWordDocuments: function(ev) {
	console.log("App.Views.OntoView.searchWordDocuments");
	var self = this;
	var concept = App.Helpers.getSelectedConcept();
    var query = $('#search-field').val();
    $('#search-word').button('loading');
	
	var resultDocs2 = function(data) {
	  console.log("Fetched the documents from ids (resultDocs2)");
	  self.viewDocuments2(data);
	}
	
    var resultDocs = function(data) {
	  $('#search-word').button('reset');
	  console.log("resulting docs: " + data.length + data);
	  concept.getDocsWithQuery2(data, resultDocs2);
    };
	
	concept.getDocsWithQuery(query, resultDocs); //concept.getDocsWithQuery3(query, resultDocs3, false);  // fullDocs is false
  }  
  // don't forget to add a comma if you put a new function after this one!

  /*
  searchWordDocuments: function(ev) {
	console.log("App.Views.OntoView.searchWordDocuments");

	var self = this;
	
	var concept = App.Helpers.getSelectedConcept();
    var query = $('#search-field').val();
    $('#search-word').button('loading');
	
	var resultDocs2 = function(data) {
	  console.log("resultDocs2");
	  console.log(data);
	  
	  self.viewDocuments2(data);
	      //this.showDocModal();
	}
	
    var resultDocs = function(data) {
	  $('#search-word').button('reset');
	  console.log("resulting docs: " + data.length + data);

	  //var url ="/elyciteapi/ontologies/onto_/documents/"
	  // var url = App.Helpers.getSelectedConcept().toJSON().links.ontology + "documents/";
	  concept.getDocsWithQuery2(data, resultDocs2);
    };
	
    var resultDocs3 = function(data) {
	  console.log("resultDocs3");
	  console.log(data);
	  self.viewDocuments2(data);
	      //this.showDocModal();
	}
	
	
	//concept.getDocsWithQuery3(query, resultDocs3, true);
	concept.getDocsWithQuery(query, resultDocs);
	
  }   // don't forget to add a comma if you put a new function after this one!
  */
  
  /*
  searchWordDocuments: function(ev) {
	console.log("App.Views.OntoView.searchWordDocuments");

	var self = this;
	
	var concept = App.Helpers.getSelectedConcept();
    var query = $('#search-field').val();
    $('#search-word').button('loading');
	
	var resultDocs2 = function(data) {
	  console.log("resultDocs2");
	  console.log(data);
	  
	  self.viewDocuments2(data);
	      //this.showDocModal();
	}
	
    var resultDocs = function(data) {
	  $('#search-word').button('reset');
	  console.log("resulting docs: " + data.length + data);

	  //var url ="/elyciteapi/ontologies/onto_/documents/"
	  // var url = App.Helpers.getSelectedConcept().toJSON().links.ontology + "documents/";
	  concept.getDocsWithQuery2(data, resultDocs2);
    };
	
	concept.getDocsWithQuery(query, resultDocs);
  }   // don't forget to add a comma if you put a new function after this one!
  */
});
