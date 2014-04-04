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
     "click #delete-move": "deleteMoveConcept",
     "click #vis-decrease": "decreaseVisualizationSize",
     "click #vis-increase": "increaseVisualizationSize",
     "click #vis-download": "downloadVisualization",

     "click #suggest-concepts": "showSuggestConcepts",
     "click #suggest": "suggestConcepts",
     "click #add-suggested": "addSuggested",

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
    $('#modal-suggest').on('hidden.bs.modal', function (e) {
      $('#modal-suggest').remove();
    });
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
    // get current concept (parent of query)
    var cid = $(ev.currentTarget).data("cid");
    var c = App.State.concepts.findWhere({$id: cid});
    var queryType = $("#query-type").find("label.active").find("input").attr('id');

    // Simple Query
    if(queryType === "query-opt-simple") {
      App.State.queryConcept = new App.Models.Concept();
      App.State.queryConcept.set("query", queryText);
      this.listenToOnce(App.State.queryConcept, "change", this.renderQueryResult);
      this.listenToOnce(App.State.queryConcept, "destroy", this.renderNoResults);

      var setQueryConcept = function(data) {
        if(data.hasOwnProperty('isEmpty')) {
          App.State.queryConcept.destroy();
          return;
        }
        App.State.queryConcept.set(data);
      };
      c.getQuerySuggestion(queryText, setQueryConcept);
      return;
    }
    // Active Learner Query
    // make query and set AL, make question = true
    App.State.currentAL = new App.Models.AL({concept: c, 
                                             query: queryText});
    this.listenTo(App.State.currentAL, "change", this.renderQuestion);
    App.State.currentAL.save();
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
    if(App.State.queryConcept) {
      App.State.queryConcept.destroy();
    }
  },

  finishQuery: function(ev) {
    console.log("App.Views.OntoView.finishQuery");
    // check if simple query
    var alid = $(ev.currentTarget).data("alid");
    console.log("ALID = " + alid);
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
    // make sure AL is available
    if(!App.State.currentAL) {
      return;
    }
    // add concept from al
    var addConceptFromAL = function(data) {
      App.State.concepts.create(data);
      App.State.currentAL.destroy();
    };
    App.State.currentAL.getConcept(addConceptFromAL);
  },

  showDocModal: function() {
    var concept = App.Helpers.getSelectedConcept();
    var conceptjs = concept.toJSON();
    var self = this;
    concept.getDocs(function() {
      $(self.el).append(self.documentsTemplate({concept: conceptjs}));
      self.appendToDocList();
      // @TODO show loading indicator
      $('#docs-modal').modal('show');
      
      // bind events
      self.listenTo(App.State.Documents, 'sync', self.appendToDocList);
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
    var docsUrl = concept.get("links").ontology + "documents/"; // @TODO
    // remove if exists
    if($('#docs-modal').length > 0) {
        $('#docs-modal').remove();
    }

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

  prepareDocView: function(concept) {
    var docsjs = App.State.Documents.toJSON();

    // remove the ones that were already in there
    var startPos = $('#doclist-items').children().length;
    docsjs = docsjs.slice(startPos);

    // summarize (client side version)
    var summarize = function(val) {
      val.summary = val.text.substring(0, 30);
      return val;
    };
    docsjs = docsjs.map(summarize);

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
    var setKeywords = function(data) {
      concept.set(data, {silent: true});
      concept.save();
      //$("#input-keywords").val(data.keywords);
    };
    concept.getKeywordsSuggestion(setKeywords);
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
      $(self.el).append(self.buildTemplate({concept:conceptjs, langopts:lopts}));
      $('#modal-build').modal('show');
      // set defaults
      $('#cls-stopwordsPicker').val(conceptjs.stopwords);
      $('#cls-stemmerPicker').val(conceptjs.stemmer);
    };
    concept.getDocs(display);
  },

  buildClassifier: function(ev) {
    var cid = $(ev.currentTarget).data("cid");
    var concept = App.State.concepts.findWhere({$id: cid});
    var classifiersUrl = concept.get("links").ontology + "classifiers/";
    // get options
    var name = $("#cls-name").val() || "default";
    name = concept.get("ontology") + "_" + name;
    var stopwords = $('#cls-stopwordsPicker').val();
    var stemmer =  $('#cls-stemmerPicker').val();
    var c = parseInt($("#cls-param-c").val());
    var j = parseFloat($("#cls-param-j").val());
    var opts = {
      name:name,
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
      $('#modal-classify').on('hidden.bs.modal', function (e) {
        $('#modal-classify').remove();
      });
    });
    classifiers.fetch();
  },


  classifyConcept: function() {
    console.log("App.Views.OntoView.classifyConcept");
    var cls = $("#classifierPicker").val();

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
  }

});
