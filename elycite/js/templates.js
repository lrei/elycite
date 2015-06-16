(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['actionbar'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\r\n    <option>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\r\n    ";
  return buffer;
  }

  buffer += "<div class=\"row\">\r\n<form class=\"form-inline\" role=\"form\">\r\n  <div class=\"form-group col-xs-2\" style=\"padding-left:0px;\">\r\n    <label class=\"sr-only\" for=\"inputName\">Name</label>\r\n    <input type=\"text\" class=\"form-control input-sm\" id=\"input-name\" value=\"";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-trigger=\"hover\" data-title=\"Name\">\r\n  </div>\r\n  <div class=\"form-group col-xs-4\">\r\n    <label class=\"sr-only\" for=\"inputKeywords\">Keywords</label>\r\n    <input type=\"text\" class=\"form-control input-sm\" id=\"input-keywords\" value=\"";
  if (helper = helpers.keywords) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.keywords); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-trigger=\"hover\" data-title=\"Keywords\">\r\n  </div>\r\n  <div class=\"form-group col-xs-6\">\r\n  <button id=\"change-concept\" type=\"button\" class=\"btn btn-primary btn-sm\" data-loading-text=\"Changing...\">Change</button>\r\n  <button id=\"suggest-keywords\" type=\"button\" class=\"btn btn-warning btn-sm\" data-loading-text=\"Loading...\">Suggest Keywords</button>\r\n  <!-- Field -->\r\n  <select class=\"selectpicker\" data-width=\"100px\" data-style=\"btn-info btn-sm\" title=\"Field\" id=\"barFieldPicker\">\r\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.textFields), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  </select>\r\n\r\n\r\n  <!--  <button id=\"properties-concept\" type=\"button\" class=\"btn btn-default btn-sm\">Properties</button> -->\r\n  <button id=\"view-documents\" type=\"button\" class=\"btn btn-default btn-sm\" data-loading-text=\"Opening...\">Documents</button>\r\n  <button id=\"build-classifier\" type=\"button\" class=\"btn btn-success btn-sm\">Build</button>\r\n  \r\n</div>\r\n</form> \r\n</div>\r\n<div class=\"row\" style=\"margin-top:10px\">\r\n  <form class=\"form-inline\" role=\"form\">\r\n    <button id=\"new-concept\" type=\"button\" class=\"btn btn-success btn-sm\">New Sub-Concept</button>\r\n    <button id=\"suggest-concepts\" type=\"button\" class=\"btn btn-primary btn-sm\">Suggest Sub-Concepts</button>\r\n    <button id=\"query-concept\" type=\"button\" class=\"btn btn-primary btn-sm query-concept\">Sub-Concept From Query</button>\r\n    <button id=\"classify-concept\" type=\"button\" class=\"btn btn-primary btn-sm\">Classify</button>\r\n    <button id=\"move-concept\" type=\"button\" class=\"btn btn-warning btn-sm\">Move</button>\r\n    <button id=\"delete-concept\" type=\"button\" class=\"btn btn-danger btn-sm\">Delete</button>\r\n    <button id=\"vis-decrease\" type=\"button\" class=\"btn btn-default\" title=\"decrease visualization size\">\r\n      <span class=\"glyphicon glyphicon-minus\"></span>\r\n    </button>\r\n    <button id=\"vis-increase\" type=\"button\" class=\"btn btn-default\" title=\"Increase visualization size\">\r\n      <span class=\"glyphicon glyphicon-plus\"></span>\r\n    </button>\r\n    <button id=\"vis-download\" type=\"button\" class=\"btn btn-default\" title=\"Download visualization\">\r\n      <span class=\"glyphicon glyphicon-download\"></span>\r\n    </button>\r\n    <select class=\"selectpicker\" id=\"visualization-picker\" data-width=\"160px\" title=\"Visualization style\">\r\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.visualizations), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    </select>\r\n\r\n  </form> \r\n</div>\r\n\r\n";
  return buffer;
  });
templates['answerbuttons'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<form class=\"form-horizontal\" role=\"form\">\r\n  <div class=\"form-group\">\r\n    <button data-alid=";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " data-answer=1 type=\"button\" class=\"btn btn-primary pull-left answer-question\" data-loading-text=\"Answering...\">Yes</button>\r\n    <button data-alid=";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " data-answer=0 type=\"button\" class=\"btn btn-default pull-left answer-question\" data-loading-text=\"Answering...\">No</button>\r\n    <button data-alid=";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " type=\"button\" data-dismiss=\"modal\" class=\"btn btn-danger pull-right cancel-question\" data-loading-text=\"Canceling...\">Cancel</button>\r\n  </div>\r\n</form>\r\n";
  return buffer;
  });
templates['buildmodal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\r\n            <option>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\r\n            ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "";
  buffer += "\r\n                        <option>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\r\n                        ";
  return buffer;
  }

  buffer += "<!-- Modal -->\r\n<div class=\"modal fade\" id=\"modal-build\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal-query-label\" aria-hidden=\"true\">\r\n  <div class=\"modal-dialog\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close cancel-question\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\r\n        <h4 class=\"modal-title\" id=\"modal-query-label\">Build classifier for "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\r\n      </div>\r\n      <div class=\"modal-body\" id=\"modal-build-main\">\r\n        <p>Keywords: "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.keywords)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n        <p>Positive examples: "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.ndocs)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n        <div class=\"input-group\">\r\n          <span class=\"input-group-addon\">Name</span>\r\n          <input id=\"cls-name\" type=\"text\" class=\"form-control\" placeholder=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.ontology)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "_\">\r\n        </div>\r\n        <div class=\"input-group\" style=\"margin-top:5px;\">\r\n          <select class=\"selectpicker\" data-width=\"100px\" data-style=\"btn-info\" title=\"Field\" id=\"fieldPicker\">\r\n            ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.textFields), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n          </select>\r\n        </div>\r\n        <!-- advance options accordion -->\r\n        <div class=\"panel-group\" id=\"accordion\" style=\"margin-top:5px;\">\r\n          <div class=\"panel panel-default\">\r\n            <div class=\"panel-heading\">\r\n              <h4 class=\"panel-title\">\r\n                <a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse"
    + escapeExpression(((stack1 = (depth0 && depth0.storeId)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n                  Advanced options\r\n                </a>\r\n              </h4>\r\n            </div> <!-- /panel heading -->\r\n            <div id=\"collapse"
    + escapeExpression(((stack1 = (depth0 && depth0.storeId)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"panel-collapse collapse\">\r\n              <div class=\"panel-body\">\r\n                <div class=\"row\">\r\n                  <div class=\"input-group\">\r\n                    <div class=\"form-group\">\r\n                      <label for=\"cls-stemmerPicker\">Stemmer: </label>\r\n                      <select class=\"selectpicker\" id=\"cls-stemmerPicker\">\r\n                        ";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.langopts)),stack1 == null || stack1 === false ? stack1 : stack1.stemmer), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n                      </select>\r\n                    </div>\r\n                    <div class=\"form-group\">\r\n                      <label for=\"cls-stopwordsPicker\">Stopword list: </label>\r\n                      <select class=\"selectpicker\" id=\"cls-stopwordsPicker\">\r\n                        ";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.langopts)),stack1 == null || stack1 === false ? stack1 : stack1.stopwords), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n                      </select>\r\n                    </div>\r\n                    <form class=\"form-inline\" role=\"form\">\r\n                      <div class=\"form-group\">\r\n                        <div class=\"input-group\">\r\n                          <span class=\"input-group-addon\">C</span>\r\n                          <input type=\"number\" class=\"form-control\" id=\"cls-param-c\" value=\"1.0\">\r\n                        </div>\r\n                        <div class=\"input-group\">\r\n                          <span class=\"input-group-addon\">J</span>\r\n                          <input type=\"number\" class=\"form-control\" id=\"cls-param-j\" value=\"0.0\" title=\"default 0 means auto-balance.\">\r\n                        </div>\r\n                      </div>\r\n                    </form>\r\n                  </div>  <!-- input group -->\r\n                </div> <!-- /row -->\r\n              </div> <!--/panel body -->\r\n            </div> <!-- /collapse --> \r\n          </div> <!-- /panel (accordion) item -->\r\n        </div> <!-- /accordion -->\r\n      </div> <!-- /model body -->\r\n      <div id=\"modal-build-footer\" class=\"modal-footer\">\r\n        <button id=\"do-build-cls\" data-cid="
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.$id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " type=\"button\" class=\"btn btn-primary\" data-loading-text=\"Building...\">Build</button>\r\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>\r\n      </div>\r\n    </div><!-- /.modal-content -->\r\n  </div><!-- /.modal-dialog -->\r\n</div><!-- /.modal -->\r\n";
  return buffer;
  });
templates['classifiers'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n  <tr>\r\n    <td>";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n    <td>";
  if (helper = helpers.ontology) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ontology); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n    <td>";
  if (helper = helpers.url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n    <td>\r\n      <button id=\"try-cls\" type=\"button\" class=\"btn btn-primary btn-sm\" data-mid=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">Try</button>\r\n    </td>\r\n    <td>\r\n      <button id=\"delete-cls\" type=\"button\" class=\"btn btn-danger btn-sm\" data-mid=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">Delete</button>\r\n    </td>\r\n  </tr>\r\n  ";
  return buffer;
  }

  buffer += "<h1>List of Built Classifiers</h1>\r\n<table id=\"cls-table\" class=\"table table-bordered table-responsive\" style=\"margin-top:5px\">\r\n  <thead>\r\n    <tr>\r\n      <th>Name</th>\r\n      <th>Ontology</th>\r\n      <th>URL</th>\r\n    </tr>\r\n  </thead>\r\n  ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.classifiers), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</table>\r\n";
  return buffer;
  });
templates['classifymodal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n                <option>";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n                ";
  return buffer;
  }

  buffer += "<!-- Modal -->\r\n<div class=\"modal fade\" id=\"modal-classify\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal-classify-label\" aria-hidden=\"true\">\r\n  <div class=\"modal-dialog\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\r\n        <h4 class=\"modal-title\" id=\"modal-classify-label\">Classify "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\r\n      </div>\r\n      <div class=\"modal-body\" id=\"modal-classify-main\">\r\n        <form class=\"form-horizontal\" role=\"form\">\r\n          <div class=\"form-group\">\r\n            <label  class=\"col-sm-2 control-label\" style=\"text-align:left;\" for=\"classifierPicker\">Classifier</label>\r\n            <div class=\"col-sm-10\">\r\n              <select class=\"selectpicker\" id=\"classifierPicker\">\r\n                ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.classifiers), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n              </select>\r\n              <button type=\"button\" id='do-classify' class=\"btn btn-primary\" data-loading-text=\"Classifying...\">Classify</button>\r\n            </div>\r\n          </div>\r\n        </form>\r\n        <table id=\"suggestions-table\" class=\"table table-bordered table-responsive\" style=\"margin-top:5px\">\r\n        </table>\r\n      </div>\r\n      <div class=\"modal-footer\">\r\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\r\n      </div>\r\n    </div><!-- /.modal-content -->\r\n  </div><!-- /.modal-dialog -->\r\n</div><!-- /.modal -->\r\n";
  return buffer;
  });
templates['deletemodal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <div class=\"form-group\" style=\"margin-top:5px\">\r\n          <label for=\"picker-destination\">Destination: </label>\r\n          <select class=\"selectpicker\" id=\"picker-destination\">\r\n            ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.concepts), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " <!-- end of each field -->\r\n          </select>\r\n        </div> <!-- /from group -->\r\n        ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n            <option data-did=";
  if (helper = helpers.$id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.$id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n            ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <button data-cid="
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.$id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " type=\"button\" id='delete-sub' class=\"btn btn-danger\" style=\"margin-top:5px\" data-loading-text=\"Deleting...\">Delete Sub Concepts</button>\r\n        <button data-cid="
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.$id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " type=\"button\" id='delete-move' class=\"btn btn-warning\" style=\"margin-top:5px\" data-loading-text=\"Deleting...\">Delete and Move Sub Concepts</button>\r\n        ";
  return buffer;
  }

  buffer += "<!-- Modal -->\r\n<div class=\"modal fade\" id=\"modal-delete\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal-delete-label\" aria-hidden=\"true\">\r\n  <div class=\"modal-dialog\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\r\n        <h4 class=\"modal-title\" id=\"modal-delete-label\">Delete "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\r\n      </div>\r\n      <div class=\"modal-body\" id=\"modal-delete-main\">\r\n        ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.hasChildren), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n      </div>\r\n      <div class=\"modal-footer\">\r\n        <button data-cid="
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.$id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " type=\"button\" id='delete-all' class=\"btn btn-danger\" style=\"margin-top:5px\" data-loading-text=\"Deleting...\">Delete</button>\r\n        ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.hasChildren), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\r\n      </div>\r\n    </div><!-- /.modal-content -->\r\n  </div><!-- /.modal-dialog -->\r\n</div><!-- /.modal -->\r\n";
  return buffer;
  });
templates['doclistitems'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.selected), {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n      ";
  if (helper = helpers.$id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.$id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\r\n    </a>\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n    <a href=\"#\" class=\"list-group-item active doc-list-item\" data-did=";
  if (helper = helpers.$id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.$id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ">\r\n    ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n    <a href=\"#\" class=\"list-group-item doc-list-item\" data-did=";
  if (helper = helpers.$id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.$id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ">\r\n    ";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, (depth0 && depth0.docs), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  return buffer;
  });
templates['docsmodal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!-- View Concept Documents Modal -->\r\n<div class=\"modal fade\" id=\"docs-modal\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"docs-modal-label\" aria-hidden=\"true\">\r\n  <div class=\"modal-dialog docmodal\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>		\r\n        <h4 class=\"modal-title\">Documents for "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\r\n		\r\n		\r\n			<input type=\"text\" id=\"search-field\" size=\"35\" class=\"form-control\" placeholder=\"Search\">			\r\n			<button id=\"search-word\" type=\"button\" class=\"btn btn-default\" ><span class=\"glyphicon glyphicon-search\"></span></button>\r\n			\r\n      </div> <!-- /modal header -->\r\n      <div class=\"modal-body\">\r\n        <div class=\"row\">\r\n          <!-- document list -->\r\n          <div id=\"doclist\" class=\"col-xs-2\" style=\"max-height:500px; overflow-y:scroll;\">\r\n            <div class=\"list-group\" id=\"doclist-items\"> \r\n              <!-- doclist-items goes here -->\r\n            </div> <!-- /list group -->\r\n          </div> <!-- /document list -->\r\n          <!-- document properties -->\r\n          <div id=\"document-details\" class=\"col-xs-10\" style=\"max-height:500px; overflow-y:scroll;\">\r\n          </div> <!-- /document properties -->\r\n        </div>\r\n        <div class=\"panel panel-default\">\r\n          <div class=\"panel-body\">\r\n            Click to view, double click to select (or deselect).\r\n          </div>\r\n        </div>\r\n     </div> <!-- /modal body -->\r\n     <div class=\"modal-footer\">\r\n\r\n        <button id=\"docs-close\" type=\"button\" class=\"btn\" data-dismiss=\"modal\">Close</button>\r\n      </div> <!-- /modal footer -->\r\n    </div><!-- /.modal-content -->\r\n  </div><!-- /.modal-dialog -->\r\n</div> <!-- /LoadView Modal -->\r\n";
  return buffer;
  });
templates['doctable'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n<tr>\r\n  <th scope=\"row\">"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.key)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</th>\r\n  <td>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</td>\r\n</tr>\r\n  ";
  return buffer;
  }

  buffer += "<table class=\"table table-bordered table-responsive\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.document), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</table>\r\n\r\n";
  return buffer;
  });
templates['erroralert'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"alert alert-danger fade in\" id=\"nameAlert\" style=\"display: none\">\r\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\r\n  <p><strong>Invalid name!</strong> Change the name field and try again.</p>\r\n</div>\r\n<div class=\"alert alert-danger fade in\" id=\"createAlert\" style=\"display: none\">\r\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\r\n  <p><strong>Server error.</strong> Unable to create.</p>\r\n</div>\r\n<div class=\"alert alert-danger fade in\" id=\"urlAlert\" style=\"display: none\">\r\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\r\n  <p><strong>URL error.</strong> Unable to load dataset (faulty URL).</p>\r\n</div>\r\n<div class=\"alert alert-warning fade in\" id=\"loadAlert\" style=\"display: none\">\r\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\r\n  <p><strong>Server error.</strong> Unable to load ontology (probably exists).</p>\r\n</div>\r\n<div class=\"alert alert-danger fade in\" id=\"fileAlert\" style=\"display: none\">\r\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\r\n  <p><strong>No files selected!</strong> Select files and try again.</p>\r\n</div>\r\n<div class=\"alert alert-success fade in\" id=\"createdAlert\" style=\"display: none\">\r\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\r\n  <p><strong>Store created!</strong> Loading data...</p>\r\n</div>\r\n<div class=\"alert alert-danger fade in\" id=\"csvAlert\" style=\"display: none\">\r\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\r\n  <p><strong>Invalid CSV file!</strong> Try importing/exporting from an office suite.</p>\r\n</div>\r\n<div class=\"alert alert-danger fade in\" id=\"addConceptAlert\" style=\"display: none\">\r\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\r\n  <p><strong>Server error.</strong> Unable to add concept.</p>\r\n</div>\r\n<div class=\"alert alert-warning fade in\" id=\"emptyOntologyList\" style=\"display: none\">\r\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\r\n  <p><strong>There are no ontologies to load.</strong> Create one first using Ontology->New.</p>\r\n</div>\r\n<div class=\"alert alert-warning fade in\" id=\"emptyStoreList\" style=\"display: none\">\r\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\r\n  <p><strong>There are no data stores to load.</strong> Load data into QMiner or Elycite using Data->Store From Dataset.</p>\r\n</div>\r\n<div class=\"alert alert-success fade in\" id=\"uploadComplete\" style=\"display: none\">\r\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\r\n  <p><strong>Uploading data completed successfully.</strong>You can now leave this page and use the data .</p>\r\n</div>\r\n<div class=\"alert alert-danger fade in\" id=\"uploadFailed\" style=\"display: none\">\r\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\r\n  <p><strong>Uploading data failed.</strong>Not all records will be available.</p>\r\n</div>\r\n<div class=\"alert alert-success fade in\" id=\"exportFileCreated\" style=\"display: none\">\r\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\r\n  <p><strong>Export file created.</strong>The file is not available on the elyciteapi sandbox.</p>\r\n</div>\r\n<div class=\"alert alert-danger fade in\" id=\"exportFileFailed\" style=\"display: none\">\r\n  <button id=\"modalClose\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\r\n  <p><strong>Export file creation failed.</strong></p>\r\n</div>\r\n";
  });
templates['exportviz'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<!-- Export Visualization Modal -->\r\n<div class=\"modal fade\" id=\"exportviz-modal\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exportviz-modal-label\" aria-hidden=\"true\">\r\n  <div class=\"modal-dialog\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\r\n        <h4 class=\"modal-title\">Export Visualization</h4>\r\n      </div> <!-- /modal header -->\r\n      <div class=\"modal-body\">\r\n        <div class=\"form-group\">\r\n          <label for=\"input-viz-filename\">File Name: </label>\r\n          <input type=\"text\" class=\"form-control\" id=\"input-viz-filename\" value=\"ontology\">\r\n        </div>\r\n      </div> <!-- /modal body -->\r\n      <div class=\"modal-footer\">\r\n        <button id=\"close\" type=\"button\" class=\"btn\" data-dismiss=\"modal\">Cancel</button>\r\n        <button id=\"save\" type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Save</button>\r\n      </div> <!-- /modal footer -->\r\n    </div><!-- /.modal-content -->\r\n  </div><!-- /.modal-dialog -->\r\n</div> <!-- /LoadView Modal -->\r\n";
  });
templates['fieldpicker'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <option>"
    + escapeExpression(((stack1 = (depth0 && depth0.fieldName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</option>\r\n      ";
  return buffer;
  }

  buffer += "<div class=\"form-group\" id=\"field-picker-control\">\r\n  <label class=\"col-sm-4  control-label\" for=\"field-picker\">Document Fields</label>\r\n  <div class=\"col-sm-8\">\r\n    <select class=\"selectpicker\" id=\"field-picker\" multiple>\r\n      ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.fields), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    </select>\r\n  </div>\r\n</div>\r\n\r\n";
  return buffer;
  });
templates['filelist'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<li><strong>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</strong> ";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " - ";
  if (helper = helpers.size) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.size); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " bytes, last modified: ";
  if (helper = helpers.lastModified) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lastModified); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\r\n";
  return buffer;
  }

  buffer += "<ul>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.files), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</ul>\r\n";
  return buffer;
  });
templates['guided'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!-- Guided Learning Modal -->\r\n<div class=\"modal fade\" id=\"gl-modal\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"docs-modal-label\" aria-hidden=\"true\">\r\n  <div class=\"modal-dialog docmodal\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\r\n        <h4 class=\"modal-title\">Querying in "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\r\n      </div> <!-- /modal header -->\r\n      <div class=\"modal-body\">\r\n        <form class=\"form-inline\" role=\"form\">\r\n          <div class=\"form-group\" style=\"margin-top:5px\">\r\n            <textarea id=\"query-text\" class=\"form-control\" rows=\"1\"></textarea>\r\n          </div> <!-- /from group -->\r\n        <button id=\"make-gl-query\" data-cid="
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.$id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " type=\"button\" class=\"btn btn-primary\" data-loading-text=\"Querying...\">Query</button>\r\n        </form>\r\n        <div class=\"row\">\r\n          <!-- document list -->\r\n          <div id=\"doclist\" class=\"col-xs-4\" style=\"max-height:300px; overflow-y:scroll;\">\r\n            <div class=\"list-group\" id=\"doclist-items\"> \r\n              <!-- doclist-items goes here -->\r\n            </div> <!-- /list group -->\r\n          </div> <!-- /document list -->\r\n          <!-- document properties -->\r\n          <div id=\"document-details\" class=\"col-xs-8\" style=\"max-height:300px; overflow-y:scroll;\">\r\n          </div> <!-- /document properties -->\r\n        </div>\r\n        <div class=\"panel panel-default\">\r\n          <div class=\"panel-body\">\r\n            One click to select, two to mark negative, three positive, four to remove mark.\r\n          </div>\r\n        </div>\r\n     </div> <!-- /modal body -->\r\n     <div class=\"modal-footer\">\r\n        <button id=\"gl-switch-al\" type=\"button\" class=\"btn\" data-dismiss=\"modal\">Switch to Active Learning</button>\r\n        <button id=\"gl-cancel\" type=\"button\" class=\"btn\" data-dismiss=\"modal\">Cancel</button>\r\n      </div> <!-- /modal footer -->\r\n    </div><!-- /.modal-content -->\r\n  </div><!-- /.modal-dialog -->\r\n</div> <!-- /LoadView Modal -->\r\n";
  return buffer;
  });
templates['movemodal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n            <option data-did=";
  if (helper = helpers.$id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.$id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n            ";
  return buffer;
  }

  buffer += "<!-- Modal -->\r\n<div class=\"modal fade\" id=\"modal-move\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal-move-label\" aria-hidden=\"true\">\r\n  <div class=\"modal-dialog\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\r\n        <h4 class=\"modal-title\" id=\"modal-move-label\">Move "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\r\n      </div>\r\n      <div class=\"modal-body\" id=\"modal-move-main\">\r\n        <div class=\"form-group\">\r\n          <label for=\"picker-destination\">Destination: </label>\r\n          <select class=\"selectpicker\" id=\"picker-destination\">\r\n            ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.concepts), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " <!-- end of each field -->\r\n          </select>\r\n        </div> <!-- /from group -->\r\n      </div>\r\n      <div class=\"modal-footer\">\r\n        <button data-cid="
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.$id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " type=\"button\" id='move-to-destination' class=\"btn btn-warning\" data-loading-text=\"Moving...\">Move</button>\r\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\r\n      </div>\r\n    </div><!-- /.modal-content -->\r\n  </div><!-- /.modal-dialog -->\r\n</div><!-- /.modal -->\r\n";
  return buffer;
  });
templates['ontoexport'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <option>"
    + escapeExpression(((stack1 = (depth0 && depth0.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</option>\r\n        ";
  return buffer;
  }

  buffer += "<div class=\"page-header\">\r\n  <h1>Export Ontology</h1>\r\n</div>\r\n<form class=\"form-horizontal\" role=\"form\" id=\"ontology-export-form\">\r\n  <div class=\"form-group\">\r\n     <label  class=\"col-sm-4 control-label\" for=\"exportFileName\">File name</label>\r\n     <div class=\"col-sm-4\">\r\n      <input type=\"text\" class=\"form-control\" id=\"exportFileName\" placeholder=\"filename.json\">\r\n    </div>\r\n  </div>\r\n  <div class=\"form-group\">\r\n    <label class=\"col-sm-4  control-label\" for=\"ontology-picker\">Ontology</label>\r\n    <div class=\"col-sm-8\">\r\n      <select class=\"selectpicker\" id=\"ontology-picker\">\r\n        ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.ontologies), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n      </select>\r\n    </div> <!--/col-sm8 -->\r\n  </div> <!-- /form group -->\r\n</form>\r\n<div class=\"col-sm-offset-4 col-sm-8\">\r\n<button class=\"btn btn-primary pull-right\" id=\"onto-export\" data-loading-text=\"Creating...\">Export</button>\r\n<div class=\"container-fluid\">\r\n  <div class=\"row\">\r\n    <p><strong>Note:</strong> The file will be created in the QMiner sandbox directory for elicyteapi.</p>\r\n  </div>\r\n</div>\r\n";
  return buffer;
  });
templates['ontoload'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n              <option>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n              ";
  return buffer;
  }

  buffer += "<!-- OntoLoad Modal -->\r\n<div class=\"modal fade\" id=\"loadModal\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"loadModalLabel\" aria-hidden=\"true\">\r\n  <div class=\"modal-dialog\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\r\n        <h4 class=\"modal-title\">Load Ontology</h4>\r\n      </div> <!-- /modal header -->\r\n      <div class=\"modal-body\" id=\"load-body\">\r\n           <div class=\"form-group\">\r\n            <select class=\"selectpicker\" id=\"onto-picker\">\r\n              ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.ontologies), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n            </select>\r\n          </div>\r\n      </div> <!-- /modal body -->\r\n      <div class=\"modal-footer\">\r\n        <button id=\"close\" type=\"button\" class=\"btn\" data-dismiss=\"modal\">Cancel</button>\r\n        <button id=\"ontoLoad\" type=\"button\" class=\"btn btn-primary\" data-loading-text=\"Loading...\">Load</button>\r\n      </div> <!-- /modal footer -->\r\n    </div><!-- /.modal-content -->\r\n  </div><!-- /.modal-dialog -->\r\n</div> <!-- /LoadView Modal -->\r\n";
  return buffer;
  });
templates['ontonew'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n          <option>"
    + escapeExpression(((stack1 = (depth0 && depth0.storeName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</option>\r\n          ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "";
  buffer += "\r\n              <option>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\r\n              ";
  return buffer;
  }

  buffer += "<div class=\"page-header\">\r\n  <h1>Create Ontology</h1>\r\n</div>\r\n  <form class=\"form-horizontal\" role=\"form\">\r\n     <div class=\"form-group\">\r\n       <label  class=\"col-sm-4 control-label\" for=\"inputOntoName\">Ontology name</label>\r\n       <div class=\"col-sm-4\">\r\n        <input type=\"text\" class=\"form-control\" id=\"inputOntoName\" placeholder=\"onto_\">\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <label class=\"col-sm-4  control-label\" for=\"storePicker\">Store</label>\r\n      <div class=\"col-sm-8\">\r\n        <select class=\"selectpicker\" id=\"storePicker\">\r\n          ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.stores), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n        </select>\r\n      </div>\r\n    </div>\r\n\r\n    <!-- Defaults Panel -->\r\n    <div class=\"panel panel-default col-sm-6 col-sm-offset-2\">\r\n      <div class=\"panel-heading\">\r\n        <h3 class=\"panel-title\">Default Options</h3>\r\n      </div>\r\n      <div class=\"panel-body\">\r\n        <div class=\"form-group\">\r\n          <label class=\"col-sm-4 control-label\" for=\"stemmerPicker\">Stemmer</label>\r\n          <div class=\"col-sm-8\">\r\n            <select class=\"selectpicker\" id=\"stemmerPicker\">\r\n              ";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.langopts)),stack1 == null || stack1 === false ? stack1 : stack1.stemmer), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n            </select>\r\n          </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <label class=\"col-sm-4 control-label\" for=\"stopwordsPicker\">Stopwords</label>\r\n          <div class=\"col-sm-8\">\r\n            <select class=\"selectpicker\" id=\"stopwordsPicker\">\r\n              ";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.langopts)),stack1 == null || stack1 === false ? stack1 : stack1.stopwords), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n            </select>\r\n          </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <label class=\"col-sm-4 control-label\" for=\"maxngramlength\">Max n-gram length</label>\r\n          <input class=\"col-sm-2 col-sm-offset-3\" type=\"number\" id=\"maxNgramLength\" value=\"3\">\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <label class=\"col-sm-4 control-label\" for=\"minNgramFreq\">Min n-gram frequency</label>\r\n          <input class=\"col-sm-2 col-sm-offset-3\" type=\"number\" id=\"minNgramFreq\" value=5>\r\n        </div>\r\n      </div> <!-- /panel body -->\r\n    </div> <!-- /panel -->\r\n  </form>\r\n  <div class=\"col-sm-offset-4 col-sm-8\">\r\n  <button class=\"btn btn-primary pull-right\" id=\"ontoCreate\" data-loading-text=\"Creating...\">Create</button>\r\n</div>\r\n";
  return buffer;
  });
templates['ontoproperties'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h4> Details </h4>\r\n<form role=\"form\">\r\n  <div class=\"form-group\">\r\n    <label for=\"input-name\">Name</label>\r\n    <input type=\"text\" class=\"form-control\" id=\"input-name\" value=\"";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n  </div>\r\n  <div class=\"form-group\">\r\n    <label for=\"input-keywords\">Keywords</label>\r\n    <input type=\"text\" class=\"form-control\" id=\"input-keywords\" value=\"";
  if (helper = helpers.keywords) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.keywords); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n  </div>\r\n\r\n  <button type=\"button\" id=\"submit-details\" data-conceptId=";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " class=\"btn btn-default\">Submit</button>\r\n</form>\r\n";
  return buffer;
  });
templates['ontotree'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, helper, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    <ul>\r\n      ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.children), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    </ul> \r\n   ";
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
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ">\r\n    <input type=\"checkbox\" checked=\"checked\" id=\"tree-item-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\r\n    <label for=\"tree-item-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\r\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.children), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n </li>\r\n";
  return buffer;
  });
templates['ontoview'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"actionbar\"></div>\r\n<div id=\"ontoviz\"></div>\r\n\r\n\r\n";
  });
templates['querymodal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\r\n              <option>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\r\n              ";
  return buffer;
  }

  buffer += "<!-- Modal -->\r\n<div class=\"modal fade\" id=\"modal-query\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal-query-label\" aria-hidden=\"true\">\r\n  <div class=\"modal-dialog\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close cancel-question\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\r\n        <h4 class=\"modal-title\" id=\"modal-query-label\">Query "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\r\n      </div>\r\n      <div class=\"modal-body\" id=\"modal-query-main\">\r\n\r\n        <form class=\"form-horizontal\" role=\"form\">\r\n\r\n          <div class=\"form-group\" style=\"margin-top:5px\">\r\n            <textarea id=\"query-text\" class=\"form-control\" rows=\"1\"></textarea>\r\n          </div> <!-- /from group (textarea)-->\r\n\r\n          <div class=\"btn-group\" id=\"query-type\" data-toggle=\"buttons\">\r\n            <label class=\"btn btn-primary active\">\r\n              <input type=\"radio\" name=\"options\" id=\"query-opt-simple\">Simple Query\r\n            </label>\r\n            <label class=\"btn btn-primary\">\r\n              <input type=\"radio\" name=\"options\" id=\"query-opt-al\">Active Learning\r\n            </label>\r\n            <!--\r\n            <label class=\"btn btn-primary\">\r\n              <input type=\"radio\" name=\"options\" id=\"query-opt-gal\">Guided+Active Learning\r\n            </label>\r\n            -->\r\n           <select class=\"selectpicker\" data-width=\"100px\" data-style=\"btn-info\" title=\"Field\" id=\"fieldPicker\">\r\n              ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.textFields), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n            </select>\r\n          </div> <!-- /button group -->\r\n\r\n        </form> <!-- /modal body -->\r\n\r\n      </div>\r\n      <div id=\"modal-query-footer\" class=\"modal-footer\">\r\n        <button id=\"make-query\" data-cid="
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.$id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " type=\"button\" class=\"btn btn-primary\" data-loading-text=\"Querying...\">Query</button>\r\n        <button type=\"button\" class=\"btn btn-default cancel-question\" data-dismiss=\"modal\">Cancel</button>\r\n      </div>\r\n    </div><!-- /.modal-content -->\r\n  </div><!-- /.modal-dialog -->\r\n</div><!-- /.modal -->\r\n";
  return buffer;
  });
templates['queryresultbuttons'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<form class=\"form-horizontal\" role=\"form\">\r\n  <div class=\"form-group\">\r\n    <button type=\"button\" class=\"btn btn-primary pull-left query-concept\">Back</button>\r\n    <button type=\"button\" data-dismiss=\"modal\" class=\"btn btn-danger pull-right cancel-question\">Cancel</button>\r\n  </div>\r\n</form>\r\n";
  });
templates['question'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<hr/>\r\n<h5>Current Concept</h5>\r\n<table class=\"table table-bordered table-responsive\">\r\n<thead>\r\n  <tr>\r\n    <th>Name</th>\r\n    <th>Keywords</th>\r\n    <th>Docs</th>\r\n    <th></th>\r\n  </tr>\r\n</thead>\r\n<tr>\r\n  <td>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n  <td>";
  if (helper = helpers.keywords) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.keywords); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n  <td>";
  if (helper = helpers.count) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.count); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n  <td><button data-alid=";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " type=\"button\" data-dismiss=\"modal\" class=\"btn btn-success finish-question\">Add</button></td>\r\n</tr>\r\n</table>\r\n";
  return buffer;
  }

  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.mode), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;
  });
templates['storefromdata'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"page-header\">\r\n  <h1>Create Store From Dataset</h1>\r\n</div>\r\n<form class=\"form-horizontal\" role=\"form\">\r\n   <div class=\"form-group\">\r\n     <label  class=\"col-sm-4 control-label\" for=\"inputStoreName\">Store name</label>\r\n     <div class=\"col-sm-4\">\r\n      <input type=\"text\" class=\"form-control\" id=\"inputStoreName\">\r\n    </div>\r\n  </div>\r\n  <div class=\"form-group\">\r\n    <label class=\"col-sm-4 control-label\" for=\"typePicker\">File Type</label>\r\n    <div class=\"col-sm-8\">\r\n      <select class=\"selectpicker\" id=\"typePicker\">\r\n        <option>JSON</option>\r\n        <option>CSV</option>\r\n      </select>\r\n    </div>\r\n  </div>\r\n  <div class=\"form-group\">\r\n    <label class=\"col-sm-4  control-label\" for=\"files\"></label>\r\n    <div class=\"col-sm-8\">\r\n      <input type=\"file\" id=\"files\" name=\"files[]\" multiple />\r\n    </div>\r\n  </div>\r\n  \r\n  <div class=\"form-group\">\r\n    <label class=\"col-sm-4  control-label\" for=\"filesURL\">Or enter an URL</label>\r\n    <div class=\"col-sm-8\">\r\n	  <input type=\"text\" id=\"filesUrl\" class=\"form-control\" placeholder=\"URL\">	\r\n    </div>\r\n  </div>    \r\n\r\n</form>\r\n<output id=\"list\"></output>\r\n<div class=\"col-sm-offset-4 col-sm-8\">\r\n<button class=\"btn btn-primary pull-right\" id=\"storeCreate\" data-loading-text=\"Creating...\">Create</button>\r\n</div>\r\n<div>\r\n  <strong>Note: Using the QMiner <em>qm</em> utility to load data is recommended for large datasets and is always more efficient.</strong>\r\n</div>\r\n";
  });
templates['suggestmodal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\r\n              <option>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\r\n              ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "";
  buffer += "\r\n                        <option>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\r\n                        ";
  return buffer;
  }

  buffer += "<!-- Modal -->\r\n<div class=\"modal fade\" id=\"modal-suggest\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal-suggest-label\" aria-hidden=\"true\">\r\n  <div class=\"modal-dialog\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\r\n        <h4 class=\"modal-title\" id=\"modal-suggest-label\">Suggest Sub Concepts for "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.concept)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\r\n      </div>\r\n      <div class=\"modal-body\" id=\"modal-suggest-main\">\r\n        <!-- form -->\r\n        <form class=\"form-horizontal\" role=\"form\">\r\n\r\n          <div class=\"form-group\">\r\n            <label  class=\"col-sm-5 control-label\" style=\"text-align:left;\" for=\"input-number-suggestions\">Number of sub concepts</label>\r\n            <div class=\"col-sm-2\">\r\n              <input type=\"number\" class=\"form-control\" id=\"input-number-suggestions\" value=\"2\">\r\n            </div>\r\n\r\n            <!-- Field -->\r\n           <select class=\"selectpicker\" data-width=\"100px\" data-style=\"btn-info\" title=\"Field\" id=\"fieldPicker\">\r\n              ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.textFields), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n            </select>\r\n\r\n            <!-- suggest button -->\r\n            <button type=\"button\" id='suggest' class=\"btn btn-primary\" data-loading-text=\"Getting suggestions...\">Suggest</button>\r\n          </div>\r\n          <!-- /form group -->\r\n        </form>\r\n        <!-- advance options accordion -->\r\n        <div class=\"panel-group\" id=\"accordion\" style=\"margin-top:5px; margin-bottom:10px\">\r\n          <div class=\"panel panel-default\">\r\n            <div class=\"panel-heading\">\r\n              <h4 class=\"panel-title\">\r\n                <a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse"
    + escapeExpression(((stack1 = (depth0 && depth0.storeId)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n                  Advanced options\r\n                </a>\r\n              </h4>\r\n            </div> <!-- /panel heading -->\r\n            <div id=\"collapse"
    + escapeExpression(((stack1 = (depth0 && depth0.storeId)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"panel-collapse collapse\">\r\n              <div class=\"panel-body\">\r\n                <div class=\"row\">\r\n                  <div class=\"input-group\">\r\n                    <div class=\"form-group\">\r\n                      <select class=\"form-control\" id=\"cls-stemmerPicker\" title=\"Stemmer\">\r\n                        <option selected disabled>Stemmer</option>\r\n                        ";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.langopts)),stack1 == null || stack1 === false ? stack1 : stack1.stemmer), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n                      </select>\r\n                      <select class=\"form-control\" id=\"cls-stopwordsPicker\" title=\"Stopwords\">\r\n                        <option selected disabled>Stopwords</option>\r\n                        ";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.langopts)),stack1 == null || stack1 === false ? stack1 : stack1.stopwords), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n                      </select>\r\n                    </div>\r\n                    <form class=\"form-inline\" role=\"form\">\r\n                      <div class=\"form-group\">\r\n                        <div class=\"input-group\">\r\n                          <span class=\"input-group-addon\">Max. Iterations</span>\r\n                          <input type=\"number\" class=\"form-control\" id=\"numIter\" value=\"50\">\r\n                        </div>\r\n                      </div>\r\n                    </form>\r\n                    <form class=\"form-inline\" role=\"form\">\r\n                      <div class=\"form-group\">\r\n                        <div class=\"input-group\">\r\n                          <span class=\"input-group-addon\">Num. Keywords&nbsp;&nbsp;</span>\r\n                          <input type=\"number\" class=\"form-control\" id=\"numKey\" value=\"10\">\r\n                        </div>\r\n                      </div>\r\n                    </form>\r\n                  </div>  <!-- input group -->\r\n                </div> <!-- /row -->\r\n              </div> <!--/panel body -->\r\n            </div> <!-- /collapse --> \r\n          </div> <!-- /panel (accordion) item -->\r\n          <table id=\"suggestions-table\" class=\"table table-bordered table-responsive\" >\r\n        </table>\r\n      </div>\r\n      <div class=\"modal-footer\">\r\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\r\n      </div>\r\n    </div><!-- /.modal-content -->\r\n  </div><!-- /.modal-dialog -->\r\n</div><!-- /.modal -->\r\n";
  return buffer;
  });
templates['suggesttable'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.positive), {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  <td>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n  <td>";
  if (helper = helpers.keywords) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.keywords); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n  <td>";
  if (helper = helpers.numDocs) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.numDocs); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\r\n  <td><button class=\"btn btn-success add-suggested\" id=\"suggested-";
  if (helper = helpers.lid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-lid=\"";
  if (helper = helpers.lid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-loading-text=\"Adding...\">Add</button></td>\r\n</tr>\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<tr class=\"success\" data-lid=\"";
  if (helper = helpers.lid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.negative), {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<tr class=\"danger\" data-lid=\"";
  if (helper = helpers.lid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<tr data-lid=\"";
  if (helper = helpers.lid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n";
  return buffer;
  }

  buffer += "<thead>\r\n  <tr>\r\n    <th>Name</th>\r\n    <th>Keywords</th>\r\n    <th>Docs</th>\r\n    <th><button class=\"btn btn-success\" id=\"add-suggested-all\" data-loading-text=\"Adding...\">Add</button></th>\r\n  </tr>\r\n</thead>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.suggestions), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  return buffer;
  });
templates['tryclassifiermodal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!-- Modal -->\r\n<div class=\"modal fade\" id=\"modal-tryclassifier\" data-backdrop=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal-tryclassifier-label\" aria-hidden=\"true\">\r\n  <div class=\"modal-dialog\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\r\n        <h4 class=\"modal-title\" id=\"modal-tryclassifier-label\">Classify with ";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\r\n      </div>\r\n      <div class=\"modal-body\" id=\"modal-tryclassifier-main\">\r\n        <form class=\"form-horizontal\" role=\"form\">\r\n          <div class=\"form-group\" style=\"margin-top:5px\">\r\n            <textarea id=\"tryclassifier-text\" class=\"form-control\" rows=\"5\"></textarea>\r\n          </div> <!-- /from group -->\r\n        </form>\r\n        <div id=\"classification\" class=\"center-block\">\r\n        </div>\r\n      </div> <!-- /.modal-body -->\r\n      <div id=\"modal-tryclassifier-footer\" class=\"modal-footer\">\r\n        <button id=\"do-try-cls\" data-mid=";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " type=\"button\" class=\"btn btn-primary\" data-loading-text=\"Classifying...\">Classify</button>\r\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>\r\n      </div>\r\n    </div><!-- /.modal-content -->\r\n  </div><!-- /.modal-dialog -->\r\n</div><!-- /.modal -->\r\n";
  return buffer;
  });
})();