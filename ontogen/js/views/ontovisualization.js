App.Views.OntoViz = Backbone.View.extend({
  el: "#ontoviz",

  defaultHeight: function() {
    var height = 600;
    var freeVerticalSpace = $(window).height() - $('#main-navbar').height();
    freeVerticalSpace -= $('#actiobar').height();
    //console.log("freeVerticalSpace: " + freeVerticalSpace);
    if (height < freeVerticalSpace) {
      height = freeVerticalSpace;
    }
  },

  initialize: function(attrs) {
    this.options = attrs || {};
    App.State.openids = App.State.openids || [];

    if(typeof App.State.VizOpts === "undefined") {
      var width  = $(this.el).width();
      var height = this.defaultHeight();
      var vo = {
        "height":   height,
        "name":     App.Config.VisualizationEnum[0],
      };
      App.State.VizOpts = new App.Models.VisualizationOptions(vo);
    }
    this.listenTo(App.State.VizOpts, "change", this.render);
  },

  render: function() {
    console.log("App.Views.OntoViz.render");
    this.options.height = App.State.VizOpts.get("height");
    this.options.width = App.State.VizOpts.get("width");
    $(this.el).empty();
    this.options.selector = this.el;

    // see App.Config.VisualizationEnum
    switch(App.State.VizOpts.get("name")) {
      default:
      case "Basic Force":
        this.makeBasicForceStructure();
        this.basicForce(this.options);
        break;
      case "Radial Tree":
        this.makeCollapsibleTreeStructure();
        this.radialTree(this.options);
        break;
      case "Horizontal Tree":
        this.makeCollapsibleTreeStructure();
        this.collapsibleTree(this.options);
        break;
    }
  },

  makeBasicForceStructure: function() {
    var options = this.options || {};

    // transform concepts into a set of nodes
    options.nodes = App.State.concepts.map(function(m) {
      var node = {id: m.get("$id"), label: m.get("name"), reflexive: false};
      return node;
    });
    // last node id
    options.lastNodeId = App.State.concepts.max(function(m) { return m.$id; });

    // transform relationships into links
    var tlinks = _.map(options.nodes, function(n) {
      var children  = App.State.concepts.where({parentId: n.id});
      return children.map(function(c) {
        var t = _.findWhere(options.nodes, {id: c.get("$id")});
        return {target: n, source: t, left: false, right: true };
      });
    });
    //console.log(tlinks);
    options.links = [];
    options.links = [].concat.apply([], tlinks); // flatten
    this.options = options;
    //console.log(this.options.links);
  },

  basicForce: function(options) {
    // set up SVG for D3
    var height = options.height;
    var width = options.width;
    var selector = options.selector;

    console.log("height: " + height);
    var colors = d3.scale.category10();
    self.nodeWidth = 72;
    self.nodeHeight = 24;


    var svg = d3.select(selector)
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
      .linkDistance(200)
      .charge(-1000)
      .gravity(0.05)
      .distance(200)
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
  },

  makeCollapsibleTreeStructure: function() {
    var options = this.options || {};

    var root = App.State.concepts.getRoot().toJSON();
    root.id = root.$id;

    var makeTree = function(r) {
      var c = App.State.concepts.where({parentId: r.$id}).map(function(x) { return x.toJSON();});
      var children = c.map(makeTree);
      if(children.length) {
        r.children = children;
      }
      r.id = r.$id;
      return r;
    };
    var tree = makeTree(root);
    options.root = tree;

    var maxDepth = function(r) {
      if(!r.hasOwnProperty("children")) { return 1; }
      var depth = Math.max.apply(Math, r.children.map(maxDepth));
      return depth + 1;
    };
    options.maxDepth = maxDepth(tree);
    console.log(options.maxDepth);
    this.options = options;
    //console.log(tree);
  },

  // based on http://bl.ocks.org/mbostock/4339083
  collapsibleTree: function(options) {
    var selector = options.selector;
    var linklen = 340;
    var margin = {top: 20, right: 20, bottom: 20, left: 200};
    var width = options.width - margin.right - margin.left;
    var width = linklen * options.maxDepth;
    var height = options.height - margin.top - margin.bottom;
    
    var i = 0,
        duration = 750,
        root;

    var tree = d3.layout.tree()
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

    var svg = d3.select(selector).append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    root = options.root;
    root.x0 = height / 2;
    root.y0 = 0;

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

      //root.children.forEach(collapse);
      update(root);

    d3.select(self.frameElement).style("height", "800px");
    
    function update(source) {

      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse(),
          links = tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach(function(d) { d.y = d.depth * linklen; });

      // Update the nodes…
      var node = svg.selectAll("g.node")
          .data(nodes, function(d) { return d.id;});

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
          .on('click', function(d) { App.Helpers.setSelectedConcept(d.id); })
          .on("dblclick", function(d) {
            if (d.children) {
              d._children = d.children;
              d.children = null;
            }
            else {
              d.children = d._children;
              d._children = null;
            }
            update(d);
          });

      nodeEnter.append("circle")
          .attr("r", 1e-6)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeEnter.append("text")
          .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .text(function(d) { return d.name; })
          .style("fill-opacity", 1e-6);

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

      nodeUpdate.select("circle")
          .attr("r", 4.5)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeUpdate.select("text")
          .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .remove();

      nodeExit.select("circle")
          .attr("r", 1e-6);

      nodeExit.select("text")
          .style("fill-opacity", 1e-6);

      // Update the links…
      var link = svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          });

      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          })
          .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // set style
      $(".node").css({cursor: "pointer"});
      $(".node circle").css({fill: "#fff", stroke: "steelblue", "stroke-width": "1.5px"});
      $(".node text").css({font: "10px sans-serif"});
      $(".link").css({fill: "none", stroke: "#ccc", "stroke-width": "1.5px"});
    }
  },

  // based on http://bl.ocks.org/mbostock/4063550
  radialTree: function(options) {
    var linklen = 300;
    var diameter = linklen * options.maxDepth;
    var selector = options.selector;
    var duration = 750;

    var root = options.root;
    
    var tree = d3.layout.tree()
        .size([360, diameter / 2 - 120])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

    var diagonal = d3.svg.diagonal.radial()
        .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    var svg = d3.select(selector).append("svg")
        .attr("width", diameter)
        .attr("height", diameter - 20)
      .append("g")
        .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    //root.children.forEach(collapse);
    update(root);

    d3.select(self.frameElement).style("height", diameter - 150 + "px");
    
    function update(source) {
      // Compute the new tree layout.
      var nodes = tree.nodes(root),
          links = tree.links(nodes);

      // Update the nodes…
      var node = svg.selectAll("g.node")
          .data(nodes, function(d) { return d.id;});

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
          .on('click', function(d) { App.Helpers.setSelectedConcept(d.id); })
          .on("dblclick", function(d) {
            if (d.children) {
              d._children = d.children;
              d.children = null;
            }
            else {
              d.children = d._children;
              d._children = null;
            }
            update(d);
          });

      nodeEnter.append("circle")
          .attr("r", 1e-6)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeEnter.append("text")
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
        .text(function(d) { return d.name; });


      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

      nodeUpdate.select("circle")
          .attr("r", 4.5)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeUpdate.select("text")
          .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .remove();

      nodeExit.select("circle")
          .attr("r", 1e-6);

      nodeExit.select("text")
          .style("fill-opacity", 1e-6);

      // Update the links…
      var link = svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          });

      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          })
          .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // set style
      $(".node").css({cursor: "pointer"});
      $(".node circle").css({fill: "#fff", stroke: "steelblue", "stroke-width": "1.5px"});
      $(".node text").css({font: "10px sans-serif"});
      $(".link").css({fill: "none", stroke: "#ccc", "stroke-width": "1.5px"});
    }

  
  }
});
