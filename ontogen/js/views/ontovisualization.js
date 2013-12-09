App.Views.OntoViz = Backbone.View.extend({
  el: "#ontoviz",

initialize: function(attrs) {
  this.options = attrs || {};
},

render: function() {
  console.log("App.Views.OntoViz.render");
  var options = this.options;

  // transform concepts into a set of nodes
  options.nodes = App.State.concepts.map(function(m) {
    var node = {id: m.get("$id"), label: m.get("name"), reflexive: m.parentId === -1};
    return node;
  });
  // last node id
  options.lastNodeId = App.State.concepts.max(function(m) { return m.$id; });

  // transform relationships into links
  var tlinks = _.map(options.nodes, function(n) {
    var children  = App.State.concepts.where({parentId: n.id});
    return children.map(function(c) {
      t = _.findWhere(options.nodes, {id: c.get("$id")});
      return {target: n, source: t, left: false, right: true };
    });
  });
  console.log(tlinks);
  options.links = [];
  options.links = [].concat.apply([], tlinks); // flatten
  console.log(options.links);
  $(this.el).empty();
  this.frame(options);
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
      .charge(-600)
      .on('tick', tick);

    // define arrow markers for graph links
    svg.append("svg:defs").append("svg:marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");


    // handles to link and node element groups
    var path =  svg.append("svg:g").selectAll("polyline").data(links).enter()
      .append("polyline").attr("class", "link").attr("marker-mid", "url(#arrowhead)");

    var rect = svg.append('svg:g').selectAll('g');
    // NB: the function arg is crucial here! nodes are known by id, not by index!
    rect = rect.data(nodes, function(d) { return d.id; });

    // add new nodes
    var g = rect.enter().append('svg:g');

    g.append('svg:rect')
      .attr('class', 'node')
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("height", self.nodeHeight)
      .attr("width", function(d){ if(d.label) { return d.label.length*8; } return self.nodeWidth;})
      .attr("x",function(d){if(d.label) { return -d.label.length*4; } return -(self.nodeWidth/2);})
      .attr("y", -self.nodeHeight/2)
      .style('fill', '#FFF')
      .style('stroke', '#000')
      .on('click', function(d) { App.Helpers.setSelectedConcept(d.id); })
      .on('dblclick', function() { console.log("dbclick"); });

    // show node labels
    g.append('svg:text')
      .attr("dy", ".3em")
      .attr('class', 'id')
      .style("text-anchor", "middle")
      .text(function(d) { return d.label; });



    // update force layout (called automatically each iteration)
    function tick() {

      path
       .attr("x1", function(d) {return d.source.x;})
       .attr("y1", function(d) {return d.source.y;})
       .attr("x2", function(d) {return d.target.x;})
       .attr("y2", function(d) {return d.target.y;})
       .attr("points", function(d) {
          return d.source.x + "," + d.source.y + " " + 
                (d.source.x + d.target.x)/2 + "," +
                (d.source.y + d.target.y)/2 + " " +
                 d.target.x + "," + d.target.y;
       });

      rect.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    }

    // set the graph in motion
    force.start();
  }
});
