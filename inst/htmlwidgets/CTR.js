HTMLWidgets.widget({
 
  name: 'CTR',
 
  type: 'output',
 
  initialize: function(d, width, height) {
     d3.select(d).append("svg")
      .attr("width", width)
      .attr("height", height);
 
    return d3.layout.tree();
  },
   
  resize: function(d, width, height) {
     d3.select(d).select("svg")
      .attr("width", width)
      .attr("height", height);
  },
 
renderValue: function(d, x, instance) {
 
 
var margin = {top: 20, right: 20, bottom: 20, left: 120},
 width = 1800 - margin.right - margin.left,
 height = 800 - margin.top - margin.bottom;
 
var i = 0,
 duration = 750,
 root;
 
var tree = d3.layout.tree()
 .sort(function(a, b) { return d3.descending(a.size, b.size); })
 .size([height, width]);
 
var diagonal = d3.svg.diagonal()
 .projection(function(d) { return [d.y, d.x]; });
// Remove the previous svg element 
var svg = d3.select(d).select("svg");
    svg.selectAll("*").remove();
    svg.selectAll("rect.negative").remove()
 
// var svg = d3.select("body").append("svg") 
var svg = d3.select(d).append("svg")
 .attr("width", Math.max(width + margin.right + margin.left, x.options.width))
 .attr("height", Math.max(height + margin.top + margin.bottom, x.options.height))
 .append("g")
 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.selectAll("*").remove(); // REMOVE EXISTING 
 
var flare = JSON.parse(x.data); // d3.json("hi.json", function(error, flare) 
    root = flare;
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
 nodes.forEach(function(d) { d.y = d.depth * 180; });
 
// Update the nodes.
var node = svg.selectAll("g.node")
 .data(nodes, function(d) { return d.id || (d.id = ++i); })
 .style("cursor", "pointer");
 
// Enter any new nodes at the parent's previous position.
var nodeEnter = node.enter().append("g")
 .attr("class", "node")
 .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
 .on("click", click);
 
nodeEnter.append("circle")
 .attr("r", function(d) { return d.size; })
 .style({"fill": function(d) { return d._children ? x.options.color1 : d.level}, "stroke": x.options.color3, "stroke-width":"1.5px"});
 
nodeEnter.append("image")
  .attr("xlink:href", function(d) { return d.icon; })
  .attr("x", "-12px")
  .attr("y", "-12px")
  .attr("width", "24px")
  .attr("height", "24px");
       
nodeEnter.append("text")
  .attr('font-family', 'FontAwesome')
  .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
  .attr("dy", ".15em")
  .attr("transform"," translate(0,15) rotate(-30)")
  .attr("text-anchor", function(d) { return d.children || d._children ? "start" : "end"; })
  .style({"font": "10px sans-serif", "fill-opacity": 1e-6})
  .text(function(d) { return d.name; })
  .call(wrap,150);
 
// Transition nodes to their new position.
// Transition nodes to their new position.
var nodeUpdate = node.transition()
 .duration(duration)
 .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
 
nodeUpdate.select("circle")
 .attr("r", function(d) { return d.size })
 .style("fill", function(d) { return d._children ? x.options.color1 : d.level; });
 
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
 
// Update the links.
var link = svg.selectAll("path.link")
 .data(links, function(d) { return d.target.id; })
 .style({"fill": "none", "stroke": x.options.color4, "stroke-width": "1.5px"});
 
// Enter any new links at the parent's previous position.
link.enter().insert("path", "g")
 .attr("class", "link")
 .attr("d", function(d) {
     var o = {x: source.x0, y: source.y0};
     return diagonal({source: o, target: o});
     })
 .style({"fill": "none", "stroke": x.options.color4, "stroke-width": "1.5px"});
 
// Transition links to their new position.
link.transition()
 .duration(duration)
 .attr("d", diagonal)
 .style({"fill": "none", "stroke": x.options.color4, "stroke-width": "1.5px"});
 
// Transition exiting nodes to the parent's new position.
link.exit().transition()
 .duration(duration)
 .style({"fill": "none", "stroke": x.options.color4, "stroke-width": "1.5px"})
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
    }
 
// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
            }
 
update(d);
}
},
});

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 0.7, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", "1em")
                            .text(word);
            }
        }
    });
}
