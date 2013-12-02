App.Views.OntoViz = Backbone.View.extend({
  el: "#ontoviz",

  template: Handlebars.templates['actionbar'],

  initialize: function(attrs) {
    this.options = attrs || {};

    if(typeof App.State.selectedConcept === 'undefined') {
      App.State.selectedConcept = App.State.concepts.findWhere({parentId: -1});
    }

    this.listenTo(App.State.concepts, 'change', this.render);
    this.listenTo(App.State.selectedConcept, 'change', this.renderActionBar);

  },

  render: function() {
    console.log("App.Views.OntoViz.render");
    var options = this.options;
    
    // transform concepts into a set of nodes
    options.nodes = App.State.concepts.map(function(m) {
      var node = {id: m.get("id"), label: m.get("name"), reflexive: m.parentId === -1};
      return node;
    });
    // last node id
    options.lastNodeId = App.State.concepts.max(function(m) { return m.id; });
    // transform relationships into links
    var tlinks = _.map(options.nodes, function(n) {
      var children  = App.State.concepts.where({parentId: n.id});
      return children.map(function(c) {
        t = _.findWhere(options.nodes, {id: c.get("id")});
        return {target: n, source: t, left: false, right: true };
      });
    });
    console.log(tlinks);
    options.links = [];
    options.links = [].concat.apply([], tlinks); // flatten
    console.log(options.links);
    $(this.el).empty();
    this.renderActionBar();
    this.frame(options);
  },

  renderActionBar: function() {
    console.log("App.Views.OntoViz.renderActionBar");
    if(!$('#actionbar').length) {
      $(this.el).append( this.template(App.State.selectedConcept.toJSON()));
    }
    $('#actionbar').html( this.template(App.State.selectedConcept.toJSON()) );
  },

frame: function(options) {
  // set up SVG for D3
  var width  = $(this.el).width();
  var height = options.height || 600;
  var freeVerticalSpace = $(window).height() - $('#main-navbar').height() - $('#actiobar').height() - $('#main-heading').height() - 10;
  if (height < freeVerticalSpace) {
    height = freeVerticalSpace;
  }
  console.log("height: " + height);
  var colors = d3.scale.category10();
  self.nodeWidth = 72;
  self.nodeHeight = 24;


  var svg = d3.select(this.el)
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// set up initial nodes and links
//  - nodes are known by 'id', not by index in array.
//  - reflexive edges are indicated on the node (as a bold black circle).
//  - links are always source < target; edge directions are set by 'left' and 'right'.
  var nodes = options.nodes;  
  var lastNodeId = options.lastNodeId;
  var links = options.links;

  // init D3 force layout
  var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .size([width, height])
    .linkDistance(150)
    .charge(-500)
    .on('tick', tick);

    // define arrow markers for graph links
    svg.append('svg:defs').append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 6)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#000');

  svg.append('svg:defs').append('svg:marker')
    .attr('id', 'start-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 4)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M10,-5L0,0L10,5')
    .attr('fill', '#000');

  // line displayed when dragging new nodes
  var drag_line = svg.append('svg:path')
    .attr('class', 'link dragline hidden')
    .attr('d', 'M0,0L0,0');

  // handles to link and node element groups
  var path = svg.append('svg:g').selectAll('path'),
      rect = svg.append('svg:g').selectAll('g');

  // mouse event vars
  var selected_node = null,
      selected_link = null,
      mousedown_link = null,
      mousedown_node = null,
      mouseup_node = null;

  function resetMouseVars() {
    mousedown_node = null;
    mouseup_node = null;
    mousedown_link = null;
  }

  // update force layout (called automatically each iteration)
  function tick() {
    // draw directed edges with proper padding from node centers
    path.attr('d', function(d) {
      var deltaX = d.target.x - d.source.x,
      deltaY = d.target.y - d.source.y,
      dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
      normX = deltaX / dist,
      normY = deltaY / dist,
      sourcePadding = d.left ? 30 : 30,
      targetPadding = d.right ? 30 : 30,
      sourceX = d.source.x + (sourcePadding * normX),
      sourceY = d.source.y + (sourcePadding * normY),
      targetX = d.target.x - (targetPadding * normX),
      targetY = d.target.y - (targetPadding * normY);
    return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
    });

    rect.attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')';
        });
      }

      // update graph (called when needed)
      function restart() {
        // path (link) group
        path = path.data(links);

        // update existing links
        path.classed('selected', function(d) { return d === selected_link; })
      .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
      .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; });


    // add new links
    path.enter().append('svg:path')
      .attr('class', 'link')
      .classed('selected', function(d) { return d === selected_link; })
      .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
      .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; });

    // remove old links
    path.exit().remove();


    // circle (node) group
    // NB: the function arg is crucial here! nodes are known by id, not by index!
    rect = rect.data(nodes, function(d) { return d.id; });

    // update existing nodes (reflexive & selected visual states)
    rect.selectAll('rect')
      .style('fill', '#fff')
      .classed('reflexive', function(d) { return d.reflexive; });


    // add new nodes
    var g = rect.enter().append('svg:g');

    g.append('svg:rect')
      .attr('class', 'node')
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("height", self.nodeHeight)
      .attr("width", function(d){ if(d.name) { return d.name.length*6; } return self.nodeWidth;})
      .attr("x",function(d){if(d.name) { return -d.name.length*3; } return -(self.nodeWidth/2);})
      .attr("y", -self.nodeHeight/2)
      .style('fill', 'transparent')
      .style('stroke', '#000')
      .classed('reflexive', function(d) { return d.reflexive; })
      .on('mouseover', function(d) {
        console.log("Entering the matrix");
      })
    .on('mouseout', function(d) {
      console.log("Leaving the matrix");
    })
    .on('click', function(d) {
      console.log("Black Hawk Down");
      App.State.selectedConcept = App.State.concepts.findWhere({parentId: d.id});
    });

    // show node labels
    g.append('svg:text')
      .attr("dy", ".3em")
      .attr('class', 'id')
      .style("text-anchor", "middle")
      .text(function(d) { return d.label; });

    // remove old nodes
    rect.exit().remove();

    // set the graph in motion
    force.start();
    }

  
    // app starts here
    restart();
}
});
