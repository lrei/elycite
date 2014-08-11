(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['actionbar'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\n    <option>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\n    ";
  return buffer;
  }

  buffer += "<div class=\"row\">\n<form class=\"form-inline\" role=\"form\">\n  <div class=\"form-group col-xs-2\" style=\"padding-left:0px;\">\n    <label class=\"sr-only\" for=\"inputName\">Name</label>\n    <input type=\"text\" class=\"form-control input-sm\" id=\"input-name\" value=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-trigger=\"hover\" data-title=\"Name\">\n  </div>\n  <div class=\"form-group col-xs-4\">\n    <label class=\"sr-only\" for=\"inputKeywords\">Keywords</label>\n    <input type=\"text\" class=\"form-control input-sm\" id=\"input-keywords\" value=\"";
  if (stack1 = helpers.keywords) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.keywords; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-trigger=\"hover\" data-title=\"Keywords\">\n  </div>\n  <div class=\"form-group col-xs-6\">\n  <button id=\"change-concept\" type=\"button\" class=\"btn btn-primary btn-sm\" data-loading-text=\"Changing...\">Change</button>\n  <button id=\"suggest-keywords\" type=\"button\" class=\"btn btn-warning btn-sm\" data-loading-text=\"Loading...\">Suggest Keywords</button>\n  <!--  <button id=\"properties-concept\" type=\"button\" class=\"btn btn-default btn-sm\">Properties</button> -->\n  <button id=\"view-documents\" type=\"button\" class=\"btn btn-default btn-sm\" data-loading-text=\"Opening...\">Documents</button>\n  <button id=\"build-classifier\" type=\"button\" class=\"btn btn-success btn-sm\">Build</button>\n  \n</div>\n</form> \n</div>\n<div class=\"row\" style=\"margin-top:10px\">\n  <form class=\"form-inline\" role=\"form\">\n    <button id=\"new-concept\" type=\"button\" class=\"btn btn-success btn-sm\">New Sub-Concept</button>\n    <button id=\"suggest-concepts\" type=\"button\" class=\"btn btn-primary btn-sm\">Suggest Sub-Concepts</button>\n    <button id=\"query-concept\" type=\"button\" class=\"btn btn-primary btn-sm query-concept\">Sub-Concept From Query</button>\n    <button id=\"classify-concept\" type=\"button\" class=\"btn btn-primary btn-sm\">Classify</button>\n    <button id=\"move-concept\" type=\"button\" class=\"btn btn-warning btn-sm\">Move</button>\n    <button id=\"delete-concept\" type=\"button\" class=\"btn btn-danger btn-sm\">Delete</button>\n    <button id=\"vis-decrease\" type=\"button\" class=\"btn btn-default\" title=\"decrease visualization size\">\n      <span class=\"glyphicon glyphicon-minus\"></span>\n    </button>\n    <button id=\"vis-increase\" type=\"button\" class=\"btn btn-default\" title=\"Increase visualization size\">\n      <span class=\"glyphicon glyphicon-plus\"></span>\n    </button>\n    <button id=\"vis-download\" type=\"button\" class=\"btn btn-default\" title=\"Download visualization\">\n      <span class=\"glyphicon glyphicon-download\"></span>\n    </button>\n    <select class=\"selectpicker\" id=\"visualization-picker\" data-width=\"160px\" title=\"Visualization style\">\n    ";
  stack1 = helpers.each.call(depth0, depth0.visualizations, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </select>\n\n  </form> \n</div>\n\n";
  return buffer;
  });
templates['answerbuttons'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<form class=\"form-horizontal\" role=\"form\">\n  <div class=\"form-group\">\n    <button data-alid=";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " data-answer=1 type=\"button\" class=\"btn btn-primary pull-left answer-question\" data-loading-text=\"Answering...\">Yes</button>\n    <button data-alid=";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " data-answer=0 type=\"button\" class=\"btn btn-default pull-left answer-question\" data-loading-text=\"Answering...\">No</button>\n    <button data-alid=";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " type=\"button\" data-dismiss=\"modal\" class=\"btn btn-danger pull-right cancel-question\" data-loading-text=\"Canceling...\">Cancel</button>\n  </div>\n</form>\n";
  return buffer;
  });
templates['buildmodal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\n                        <option>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\n                        ";
  return buffer;
  }

  buffer += "<!-- Modal -->\n<div class=\"modal fade\" id=\"modal-build\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal-query-label\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close cancel-question\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n        <h4 class=\"modal-title\" id=\"modal-query-label\">Build classifier for "
    + escapeExpression(((stack1 = ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\n      </div>\n      <div class=\"modal-body\" id=\"modal-build-main\">\n        <p>Keywords: "
    + escapeExpression(((stack1 = ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.keywords)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\n        <p>Positive examples: "
    + escapeExpression(((stack1 = ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.ndocs)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\n        <div class=\"input-group\">\n          <span class=\"input-group-addon\">Name</span>\n          <input id=\"cls-name\" type=\"text\" class=\"form-control\" placeholder=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.ontology)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "_\">\n        </div>\n        <div class=\"panel-group\" id=\"accordion\" style=\"margin-top:5px;\">\n          <div class=\"panel panel-default\">\n            <div class=\"panel-heading\">\n              <h4 class=\"panel-title\">\n                <a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse"
    + escapeExpression(((stack1 = depth0.storeId),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n                  Advanced options\n                </a>\n              </h4>\n            </div> <!-- /panel heading -->\n            <div id=\"collapse"
    + escapeExpression(((stack1 = depth0.storeId),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"panel-collapse collapse\">\n              <div class=\"panel-body\">\n                <div class=\"row\">\n                  <div class=\"input-group\">\n                    <div class=\"form-group\">\n                      <label for=\"cls-stemmerPicker\">Stemmer: </label>\n                      <select class=\"selectpicker\" id=\"cls-stemmerPicker\">\n                        ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.langopts),stack1 == null || stack1 === false ? stack1 : stack1.stemmer), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                      </select>\n                    </div>\n                    <div class=\"form-group\">\n                      <label for=\"cls-stopwordsPicker\">Stopword list: </label>\n                      <select class=\"selectpicker\" id=\"cls-stopwordsPicker\">\n                        ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.langopts),stack1 == null || stack1 === false ? stack1 : stack1.stopwords), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                      </select>\n                    </div>\n                    <form class=\"form-inline\" role=\"form\">\n                      <div class=\"form-group\">\n                        <div class=\"input-group\">\n                          <span class=\"input-group-addon\">C</span>\n                          <input type=\"number\" class=\"form-control\" id=\"cls-param-c\" value=\"1.0\">\n                        </div>\n                        <div class=\"input-group\">\n                          <span class=\"input-group-addon\">J</span>\n                          <input type=\"number\" class=\"form-control\" id=\"cls-param-j\" value=\"0.0\" title=\"default 0 means auto-balance.\">\n                        </div>\n                      </div>\n                    </form>\n                  </div>  <!-- input group -->\n                </div> <!-- /row -->\n              </div> <!--/panel body -->\n            </div> <!-- /collapse --> \n          </div> <!-- /panel (accordion) item -->\n        </div> <!-- /accordion -->\n      </div> <!-- /model body -->\n      <div id=\"modal-build-footer\" class=\"modal-footer\">\n        <button id=\"do-build-cls\" data-cid="
    + escapeExpression(((stack1 = ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.$id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " type=\"button\" class=\"btn btn-primary\" data-loading-text=\"Building...\">Build</button>\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>\n      </div>\n    </div><!-- /.modal-content -->\n  </div><!-- /.modal-dialog -->\n</div><!-- /.modal -->\n";
  return buffer;
  });
templates['classifiers'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <tr>\n    <td>";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n    <td>";
  if (stack1 = helpers.ontology) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.ontology; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n    <td>";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n    <td>\n      <button id=\"try-cls\" type=\"button\" class=\"btn btn-primary btn-sm\" data-mid=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">Try</button>\n    </td>\n    <td>\n      <button id=\"delete-cls\" type=\"button\" class=\"btn btn-danger btn-sm\" data-mid=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">Delete</button>\n    </td>\n  </tr>\n  ";
  return buffer;
  }

  buffer += "<h1>List of Built Classifiers</h1>\n<table id=\"cls-table\" class=\"table table-bordered table-responsive\" style=\"margin-top:5px\">\n  <thead>\n    <tr>\n      <th>Name</th>\n      <th>Ontology</th>\n      <th>URL</th>\n    </tr>\n  </thead>\n  ";
  stack1 = helpers.each.call(depth0, depth0.classifiers, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</table>\n";
  return buffer;
  });
templates['classifymodal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                <option>";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</option>\n                ";
  return buffer;
  }

  buffer += "<!-- Modal -->\n<div class=\"modal fade\" id=\"modal-classify\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal-classify-label\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n        <h4 class=\"modal-title\" id=\"modal-classify-label\">Classify "
    + escapeExpression(((stack1 = ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\n      </div>\n      <div class=\"modal-body\" id=\"modal-classify-main\">\n        <form class=\"form-horizontal\" role=\"form\">\n          <div class=\"form-group\">\n            <label  class=\"col-sm-2 control-label\" style=\"text-align:left;\" for=\"classifierPicker\">Classifier</label>\n            <div class=\"col-sm-10\">\n              <select class=\"selectpicker\" id=\"classifierPicker\">\n                ";
  stack2 = helpers.each.call(depth0, depth0.classifiers, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n              </select>\n              <button type=\"button\" id='do-classify' class=\"btn btn-primary\" data-loading-text=\"Classifying...\">Classify</button>\n            </div>\n          </div>\n        </form>\n        <table id=\"suggestions-table\" class=\"table table-bordered table-responsive\" style=\"margin-top:5px\">\n        </table>\n      </div>\n      <div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n      </div>\n    </div><!-- /.modal-content -->\n  </div><!-- /.modal-dialog -->\n</div><!-- /.modal -->\n";
  return buffer;
  });
templates['deletemodal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <div class=\"form-group\" style=\"margin-top:5px\">\n          <label for=\"picker-destination\">Destination: </label>\n          <select class=\"selectpicker\" id=\"picker-destination\">\n            ";
  stack1 = helpers.each.call(depth0, depth0.concepts, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " <!-- end of each field -->\n          </select>\n        </div> <!-- /from group -->\n        ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <option data-did=";
  if (stack1 = helpers.$id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.$id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</option>\n            ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <button data-cid="
    + escapeExpression(((stack1 = ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.$id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " type=\"button\" id='delete-move' class=\"btn btn-warning\" style=\"margin-top:5px\" data-loading-text=\"Deleting...\">Delete and Move Sub Concepts</button>\n        ";
  return buffer;
  }

  buffer += "<!-- Modal -->\n<div class=\"modal fade\" id=\"modal-delete\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal-delete-label\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n        <h4 class=\"modal-title\" id=\"modal-delete-label\">Delete "
    + escapeExpression(((stack1 = ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\n      </div>\n      <div class=\"modal-body\" id=\"modal-delete-main\">\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.hasChildren), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      </div>\n      <div class=\"modal-footer\">\n        <button data-cid="
    + escapeExpression(((stack1 = ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.$id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " type=\"button\" id='delete-all' class=\"btn btn-danger\" style=\"margin-top:5px\" data-loading-text=\"Deleting...\">Delete</button>\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.hasChildren), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n      </div>\n    </div><!-- /.modal-content -->\n  </div><!-- /.modal-dialog -->\n</div><!-- /.modal -->\n";
  return buffer;
  });
templates['doclistitems'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = helpers['if'].call(depth0, depth0.selected, {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      ";
  if (stack1 = helpers.summary) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.summary; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    </a>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <a href=\"#\" class=\"list-group-item active doc-list-item\" data-did=";
  if (stack1 = helpers.$id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.$id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ">\n    ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <a href=\"#\" class=\"list-group-item doc-list-item\" data-did=";
  if (stack1 = helpers.$id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.$id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ">\n    ";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0.docs, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  return buffer;
  });
templates['docsmodal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!-- View Concept Documents Modal -->\n<div class=\"modal fade\" id=\"docs-modal\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"docs-modal-label\" aria-hidden=\"true\">\n  <div class=\"modal-dialog docmodal\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n        <h4 class=\"modal-title\">Documents for "
    + escapeExpression(((stack1 = ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\n      </div> <!-- /modal header -->\n      <div class=\"modal-body\">\n        <div class=\"row\">\n          <!-- document list -->\n          <div id=\"doclist\" class=\"col-xs-4\" style=\"max-height:500px; overflow-y:scroll;\">\n            <div class=\"list-group\" id=\"doclist-items\"> \n              <!-- doclist-items goes here -->\n            </div> <!-- /list group -->\n          </div> <!-- /document list -->\n          <!-- document properties -->\n          <div id=\"document-details\" class=\"col-xs-8\" style=\"max-height:500px; overflow-y:scroll;\">\n          </div> <!-- /document properties -->\n        </div>\n        <div class=\"panel panel-default\">\n          <div class=\"panel-body\">\n            Click to view, double click to select (or deselect).\n          </div>\n        </div>\n     </div> <!-- /modal body -->\n     <div class=\"modal-footer\">\n\n        <button id=\"docs-close\" type=\"button\" class=\"btn\" data-dismiss=\"modal\">Close</button>\n      </div> <!-- /modal footer -->\n    </div><!-- /.modal-content -->\n  </div><!-- /.modal-dialog -->\n</div> <!-- /LoadView Modal -->\n";
  return buffer;
  });
templates['doctable'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<tr>\n  <th scope=\"row\">"
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.key)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</th>\n  <td>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</td>\n</tr>\n  ";
  return buffer;
  }

  buffer += "<table class=\"table table-bordered table-responsive\">\n";
  stack1 = helpers.each.call(depth0, depth0.document, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</table>\n\n";
  return buffer;
  });
templates['erroralert'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"alert alert-danger fade in\" id=\"nameAlert\" style=\"display: none\">\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\n  <p><strong>Invalid name!</strong> Change the name field and try again.</p>\n</div>\n<div class=\"alert alert-danger fade in\" id=\"createAlert\" style=\"display: none\">\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\n  <p><strong>Server error.</strong> Unable to create.</p>\n</div>\n<div class=\"alert alert-warning fade in\" id=\"loadAlert\" style=\"display: none\">\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\n  <p><strong>Server error.</strong> Unable to load ontology (probably exists).</p>\n</div>\n<div class=\"alert alert-danger fade in\" id=\"fileAlert\" style=\"display: none\">\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\n  <p><strong>No files selected!</strong> Select files and try again.</p>\n</div>\n<div class=\"alert alert-success fade in\" id=\"createdAlert\" style=\"display: none\">\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\n  <p><strong>Store created!</strong> You can now use this store.</p>\n</div>\n<div class=\"alert alert-danger fade in\" id=\"csvAlert\" style=\"display: none\">\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\n  <p><strong>Invalid CSV file!</strong> Try importing/exporting from an office suite.</p>\n</div>\n<div class=\"alert alert-danger fade in\" id=\"addConceptAlert\" style=\"display: none\">\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\n  <p><strong>Server error.</strong> Unable to add concept.</p>\n</div>\n<div class=\"alert alert-warning fade in\" id=\"emptyOntologyList\" style=\"display: none\">\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\n  <p><strong>There are no ontologies to load.</strong> Create one first using Ontology->New.</p>\n</div>\n<div class=\"alert alert-warning fade in\" id=\"emptyStoreList\" style=\"display: none\">\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\n  <p><strong>There are no data stores to load.</strong> Load data into QMiner or Elycite using Data->Store From Dataset.</p>\n</div>\n<div class=\"alert alert-success fade in\" id=\"uploadComplete\" style=\"display: none\">\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\n  <p><strong>Uploading data completed successfully.</strong>You can now leave this page and use the data .</p>\n</div>\n<div class=\"alert alert-danger fade in\" id=\"uploadFailed\" style=\"display: none\">\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\n  <p><strong>Uploading data failed.</strong>Not all records will be available.</p>\n</div>\n";
  });
templates['exportviz'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<!-- Export Visualization Modal -->\n<div class=\"modal fade\" id=\"exportviz-modal\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exportviz-modal-label\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n        <h4 class=\"modal-title\">Export Visualization</h4>\n      </div> <!-- /modal header -->\n      <div class=\"modal-body\">\n        <div class=\"form-group\">\n          <label for=\"input-viz-filename\">File Name: </label>\n          <input type=\"text\" class=\"form-control\" id=\"input-viz-filename\" value=\"ontology\">\n        </div>\n      </div> <!-- /modal body -->\n      <div class=\"modal-footer\">\n        <button id=\"close\" type=\"button\" class=\"btn\" data-dismiss=\"modal\">Cancel</button>\n        <button id=\"save\" type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Save</button>\n      </div> <!-- /modal footer -->\n    </div><!-- /.modal-content -->\n  </div><!-- /.modal-dialog -->\n</div> <!-- /LoadView Modal -->\n";
  });
templates['filelist'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<li><strong>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</strong> ";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " - ";
  if (stack1 = helpers.size) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.size; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " bytes, last modified: ";
  if (stack1 = helpers.lastModified) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.lastModified; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</li>\n";
  return buffer;
  }

  buffer += "<ul>\n";
  stack1 = helpers.each.call(depth0, depth0.files, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
  return buffer;
  });
templates['guided'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!-- Guided Learning Modal -->\n<div class=\"modal fade\" id=\"gl-modal\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"docs-modal-label\" aria-hidden=\"true\">\n  <div class=\"modal-dialog docmodal\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n        <h4 class=\"modal-title\">Querying in "
    + escapeExpression(((stack1 = ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\n      </div> <!-- /modal header -->\n      <div class=\"modal-body\">\n        <form class=\"form-inline\" role=\"form\">\n          <div class=\"form-group\" style=\"margin-top:5px\">\n            <textarea id=\"query-text\" class=\"form-control\" rows=\"1\"></textarea>\n          </div> <!-- /from group -->\n        <button id=\"make-gl-query\" data-cid="
    + escapeExpression(((stack1 = ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.$id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " type=\"button\" class=\"btn btn-primary\" data-loading-text=\"Querying...\">Query</button>\n        </form>\n        <div class=\"row\">\n          <!-- document list -->\n          <div id=\"doclist\" class=\"col-xs-4\" style=\"max-height:300px; overflow-y:scroll;\">\n            <div class=\"list-group\" id=\"doclist-items\"> \n              <!-- doclist-items goes here -->\n            </div> <!-- /list group -->\n          </div> <!-- /document list -->\n          <!-- document properties -->\n          <div id=\"document-details\" class=\"col-xs-8\" style=\"max-height:300px; overflow-y:scroll;\">\n          </div> <!-- /document properties -->\n        </div>\n        <div class=\"panel panel-default\">\n          <div class=\"panel-body\">\n            One click to select, two to mark negative, three positive, four to remove mark.\n          </div>\n        </div>\n     </div> <!-- /modal body -->\n     <div class=\"modal-footer\">\n        <button id=\"gl-switch-al\" type=\"button\" class=\"btn\" data-dismiss=\"modal\">Switch to Active Learning</button>\n        <button id=\"gl-cancel\" type=\"button\" class=\"btn\" data-dismiss=\"modal\">Cancel</button>\n      </div> <!-- /modal footer -->\n    </div><!-- /.modal-content -->\n  </div><!-- /.modal-dialog -->\n</div> <!-- /LoadView Modal -->\n";
  return buffer;
  });
templates['movemodal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <option data-did=";
  if (stack1 = helpers.$id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.$id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</option>\n            ";
  return buffer;
  }

  buffer += "<!-- Modal -->\n<div class=\"modal fade\" id=\"modal-move\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal-move-label\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n        <h4 class=\"modal-title\" id=\"modal-move-label\">Move "
    + escapeExpression(((stack1 = ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\n      </div>\n      <div class=\"modal-body\" id=\"modal-move-main\">\n        <div class=\"form-group\">\n          <label for=\"picker-destination\">Destination: </label>\n          <select class=\"selectpicker\" id=\"picker-destination\">\n            ";
  stack2 = helpers.each.call(depth0, depth0.concepts, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += " <!-- end of each field -->\n          </select>\n        </div> <!-- /from group -->\n      </div>\n      <div class=\"modal-footer\">\n        <button data-cid="
    + escapeExpression(((stack1 = ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.$id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " type=\"button\" id='move-to-destination' class=\"btn btn-warning\" data-loading-text=\"Moving...\">Move</button>\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n      </div>\n    </div><!-- /.modal-content -->\n  </div><!-- /.modal-dialog -->\n</div><!-- /.modal -->\n";
  return buffer;
  });
templates['ontoload'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n              <option>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</option>\n              ";
  return buffer;
  }

  buffer += "<!-- OntoLoad Modal -->\n<div class=\"modal fade\" id=\"loadModal\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"loadModalLabel\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n        <h4 class=\"modal-title\">Load Ontology</h4>\n      </div> <!-- /modal header -->\n      <div class=\"modal-body\" id=\"load-body\">\n           <div class=\"form-group\">\n            <select class=\"selectpicker\" id=\"onto-picker\">\n              ";
  stack1 = helpers.each.call(depth0, depth0.ontologies, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </select>\n          </div>\n      </div> <!-- /modal body -->\n      <div class=\"modal-footer\">\n        <button id=\"close\" type=\"button\" class=\"btn\" data-dismiss=\"modal\">Cancel</button>\n        <button id=\"ontoLoad\" type=\"button\" class=\"btn btn-primary\" data-loading-text=\"Loading...\">Load</button>\n      </div> <!-- /modal footer -->\n    </div><!-- /.modal-content -->\n  </div><!-- /.modal-dialog -->\n</div> <!-- /LoadView Modal -->\n";
  return buffer;
  });
templates['ontonew'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <option>"
    + escapeExpression(((stack1 = depth0.storeName),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</option>\n          ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <option>"
    + escapeExpression(((stack1 = depth0.fieldName),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</option>\n          ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "";
  buffer += "\n        <option>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\n        ";
  return buffer;
  }

  buffer += "<div class=\"page-header\">\n  <h1>Create Ontology</h1>\n</div>\n  <form class=\"form-horizontal\" role=\"form\">\n     <div class=\"form-group\">\n       <label  class=\"col-sm-4 control-label\" for=\"inputOntoName\">Ontology name</label>\n       <div class=\"col-sm-4\">\n        <input type=\"text\" class=\"form-control\" id=\"inputOntoName\" placeholder=\"onto_\">\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-sm-4  control-label\" for=\"storePicker\">Store</label>\n      <div class=\"col-sm-8\">\n        <select class=\"selectpicker\" id=\"storePicker\">\n          ";
  stack1 = helpers.each.call(depth0, depth0.stores, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </select>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-sm-4  control-label\" for=\"fieldPicker\">Field</label>\n      <div class=\"col-sm-8\">\n        <select class=\"selectpicker\" id=\"fieldPicker\">\n          ";
  stack1 = helpers.each.call(depth0, depth0.fields, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </select>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-sm-4 control-label\" for=\"stemmerPicker\">Stemmer</label>\n      <div class=\"col-sm-8\">\n        <select class=\"selectpicker\" id=\"stemmerPicker\">\n        ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.langopts),stack1 == null || stack1 === false ? stack1 : stack1.stemmer), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      </select>\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label class=\"col-sm-4 control-label\" for=\"stopwordsPicker\">Stopwords</label>\n    <div class=\"col-sm-8\">\n      <select class=\"selectpicker\" id=\"stopwordsPicker\">\n        ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.langopts),stack1 == null || stack1 === false ? stack1 : stack1.stopwords), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      </select>\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label class=\"col-sm-4 control-label\" for=\"maxngramlength\">Max n-gram length</label>\n    <input class=\"col-sm-4\" type=\"number\" id=\"maxNgramLength\" value=\"3\">\n  </div>\n  <div class=\"form-group\">\n    <label class=\"col-sm-4 control-label\" for=\"minNgramFreq\">Min n-gram frequency</label>\n    <input class=\"col-sm-4\" type=\"number\" id=\"minNgramFreq\" value=5>\n  </div>\n</form>\n <div class=\"col-sm-offset-4 col-sm-8\">\n  <button class=\"btn btn-primary pull-right\" id=\"ontoCreate\" data-loading-text=\"Creating...\">Create</button>\n</div>\n";
  return buffer;
  });
templates['ontoproperties'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h4> Details </h4>\n<form role=\"form\">\n  <div class=\"form-group\">\n    <label for=\"input-name\">Name</label>\n    <input type=\"text\" class=\"form-control\" id=\"input-name\" value=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  </div>\n  <div class=\"form-group\">\n    <label for=\"input-keywords\">Keywords</label>\n    <input type=\"text\" class=\"form-control\" id=\"input-keywords\" value=\"";
  if (stack1 = helpers.keywords) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.keywords; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  </div>\n\n  <button type=\"button\" id=\"submit-details\" data-conceptId=";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " class=\"btn btn-default\">Submit</button>\n</form>\n";
  return buffer;
  });
templates['ontotree'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <ul>\n      ";
  stack1 = helpers.each.call(depth0, depth0.children, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul> \n   ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = self.invokePartial(partials.conceptPartial, 'conceptPartial', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;
  }

  buffer += "<li data-conceptid=";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ">\n    <input type=\"checkbox\" checked=\"checked\" id=\"tree-item-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" />\n    <label for=\"tree-item-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</label>\n    ";
  stack1 = helpers['if'].call(depth0, depth0.children, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n </li>\n";
  return buffer;
  });
templates['ontoview'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"actionbar\"></div>\n<div id=\"ontoviz\"></div>\n\n\n";
  });
templates['querymodal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!-- Modal -->\n<div class=\"modal fade\" id=\"modal-query\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal-query-label\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close cancel-question\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n        <h4 class=\"modal-title\" id=\"modal-query-label\">Query "
    + escapeExpression(((stack1 = ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\n      </div>\n      <div class=\"modal-body\" id=\"modal-query-main\">\n        <form class=\"form-horizontal\" role=\"form\">\n        <div class=\"form-group\" style=\"margin-top:5px\">\n          <textarea id=\"query-text\" class=\"form-control\" rows=\"1\"></textarea>\n        </div> <!-- /from group -->\n        <div class=\"btn-group\" id=\"query-type\" data-toggle=\"buttons\">\n          <label class=\"btn btn-primary active\">\n            <input type=\"radio\" name=\"options\" id=\"query-opt-simple\">Simple Query\n          </label>\n          <label class=\"btn btn-primary\">\n            <input type=\"radio\" name=\"options\" id=\"query-opt-al\">Active Learning\n          </label>\n          <!--\n          <label class=\"btn btn-primary\">\n            <input type=\"radio\" name=\"options\" id=\"query-opt-gal\">Guided+Active Learning\n          </label>\n          -->\n        </div>\n      </form>\n      </div>\n      <div id=\"modal-query-footer\" class=\"modal-footer\">\n        <button id=\"make-query\" data-cid="
    + escapeExpression(((stack1 = ((stack1 = depth0.concept),stack1 == null || stack1 === false ? stack1 : stack1.$id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " type=\"button\" class=\"btn btn-primary\" data-loading-text=\"Querying...\">Query</button>\n        <button type=\"button\" class=\"btn btn-default cancel-question\" data-dismiss=\"modal\">Cancel</button>\n      </div>\n    </div><!-- /.modal-content -->\n  </div><!-- /.modal-dialog -->\n</div><!-- /.modal -->\n";
  return buffer;
  });
templates['queryresultbuttons'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<form class=\"form-horizontal\" role=\"form\">\n  <div class=\"form-group\">\n    <button type=\"button\" class=\"btn btn-primary pull-left query-concept\">Back</button>\n    <button type=\"button\" data-dismiss=\"modal\" class=\"btn btn-danger pull-right cancel-question\">Cancel</button>\n  </div>\n</form>\n";
  });
templates['question'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<hr/>\n<h5>Current Concept</h5>\n<table class=\"table table-bordered table-responsive\">\n<thead>\n  <tr>\n    <th>Name</th>\n    <th>Keywords</th>\n    <th>Docs</th>\n    <th></th>\n  </tr>\n</thead>\n<tr>\n  <td>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n  <td>";
  if (stack1 = helpers.keywords) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.keywords; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n  <td>";
  if (stack1 = helpers.count) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.count; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n  <td><button data-alid=";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " type=\"button\" data-dismiss=\"modal\" class=\"btn btn-success finish-question\">Add</button></td>\n</tr>\n</table>\n";
  return buffer;
  }

  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n";
  stack1 = helpers['if'].call(depth0, depth0.mode, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['storefromdata'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"page-header\">\n  <h1>Create Store From Dataset</h1>\n</div>\n<form class=\"form-horizontal\" role=\"form\">\n   <div class=\"form-group\">\n     <label  class=\"col-sm-4 control-label\" for=\"inputStoreName\">Store name</label>\n     <div class=\"col-sm-4\">\n      <input type=\"text\" class=\"form-control\" id=\"inputStoreName\">\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label class=\"col-sm-4 control-label\" for=\"typePicker\">File Type</label>\n    <div class=\"col-sm-8\">\n      <select class=\"selectpicker\" id=\"typePicker\">\n        <option>JSON</option>\n        <option>CSV</option>\n      </select>\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label class=\"col-sm-4  control-label\" for=\"files\"></label>\n    <div class=\"col-sm-8\">\n      <input type=\"file\" id=\"files\" name=\"files[]\" multiple />\n    </div>\n  </div>\n</form>\n<output id=\"list\"></output>\n<div class=\"col-sm-offset-4 col-sm-8\">\n<button class=\"btn btn-primary pull-right\" id=\"storeCreate\" data-loading-text=\"Creating...\">Create</button>\n</div>\n<div>\n  <strong>Note: Using the QMiner <em>qm</em> utility to load data is recommend for large datasets and always more effiecient.</strong>\n</div>\n";
  });
templates['suggestmodal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!-- Modal -->\n<div class=\"modal fade\" id=\"modal-suggest\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal-suggest-label\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n        <h4 class=\"modal-title\" id=\"modal-suggest-label\">Suggest Sub Concepts for ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h4>\n      </div>\n      <div class=\"modal-body\" id=\"modal-suggest-main\">\n        <form class=\"form-horizontal\" role=\"form\">\n          <div class=\"form-group\">\n            <label  class=\"col-sm-5 control-label\" style=\"text-align:left;\" for=\"input-number-suggestions\">Number of sub concepts</label>\n            <div class=\"col-sm-2\">\n              <input type=\"number\" class=\"form-control\" id=\"input-number-suggestions\" value=\"2\">\n            </div>\n            <button type=\"button\" id='suggest' class=\"btn btn-primary\" data-loading-text=\"Getting suggestions...\">Suggest</button>\n          </div>\n        </form>\n        <table id=\"suggestions-table\" class=\"table table-bordered table-responsive\" style=\"margin-top:5px\">\n        </table>\n      </div>\n      <div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n      </div>\n    </div><!-- /.modal-content -->\n  </div><!-- /.modal-dialog -->\n</div><!-- /.modal -->\n";
  return buffer;
  });
templates['suggesttable'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n";
  stack1 = helpers['if'].call(depth0, depth0.positive, {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  <td>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n  <td>";
  if (stack1 = helpers.keywords) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.keywords; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n  <td>";
  if (stack1 = helpers.numDocs) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.numDocs; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n  <td><button class=\"btn btn-success add-suggested\" id=\"suggested-";
  if (stack1 = helpers.lid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.lid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-lid=\"";
  if (stack1 = helpers.lid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.lid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-loading-text=\"Adding...\">Add</button></td>\n</tr>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<tr class=\"success\" data-lid=\"";
  if (stack1 = helpers.lid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.lid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n";
  stack1 = helpers['if'].call(depth0, depth0.negative, {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<tr class=\"danger\" data-lid=\"";
  if (stack1 = helpers.lid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.lid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<tr data-lid=\"";
  if (stack1 = helpers.lid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.lid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n";
  return buffer;
  }

  buffer += "<thead>\n  <tr>\n    <th>Name</th>\n    <th>Keywords</th>\n    <th>Docs</th>\n    <th></th>\n  </tr>\n</thead>\n";
  stack1 = helpers.each.call(depth0, depth0.suggestions, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  return buffer;
  });
templates['tryclassifiermodal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!-- Modal -->\n<div class=\"modal fade\" id=\"modal-tryclassifier\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal-tryclassifier-label\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n        <h4 class=\"modal-title\" id=\"modal-tryclassifier-label\">Classify with ";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h4>\n      </div>\n      <div class=\"modal-body\" id=\"modal-tryclassifier-main\">\n        <form class=\"form-horizontal\" role=\"form\">\n          <div class=\"form-group\" style=\"margin-top:5px\">\n            <textarea id=\"tryclassifier-text\" class=\"form-control\" rows=\"5\"></textarea>\n          </div> <!-- /from group -->\n        </form>\n        <div id=\"classification\" class=\"center-block\">\n        </div>\n      </div> <!-- /.modal-body -->\n      <div id=\"modal-tryclassifier-footer\" class=\"modal-footer\">\n        <button id=\"do-try-cls\" data-mid=";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " type=\"button\" class=\"btn btn-primary\" data-loading-text=\"Classifying...\">Classify</button>\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>\n      </div>\n    </div><!-- /.modal-content -->\n  </div><!-- /.modal-dialog -->\n</div><!-- /.modal -->\n";
  return buffer;
  });
})();