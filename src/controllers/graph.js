'use strict'

angular.module('app.graph', ['ngRoute'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/graph', {
    templateUrl: 'views/graph.html',
    controller: 'GraphCtrl'
  })
}])

/*****************************************************************
*
* GraphCtrl controlller
*
******************************************************************/
.controller('GraphCtrl', function($scope, $location, Criteria, Place, Connection) {

  /**
   * Get data from local storage
   */
  var criteria = Criteria.get()
  var places = Place.get()
  var connections = Connection.get()

  $scope.criteria = function() {
    return criteria
  }
  $scope.places = function() {
    return places
  }

  var nodes = _.map(places, function(place) {
    return {
      id: place['@id'],
      name: place.name
      // classes: 'bg-blue',
      // selected: true,
      // selectable: true,
      // locked: true,
      // grabbable: true
    }
  })

  // Cytoscape had a 'data' sub object, d3 does not so lets convert
  var links = _.map(connections, function(link) {
    // return link.data
    return {
      source: link.data.source,
      target: link.data.target
    }
  })

  console.log(nodes)

  console.log(links)

  // d3 graph example from: https://bl.ocks.org/mbostock/4062045
  // d3 responsive viewport: http://stackoverflow.com/questions/9400615/whats-the-best-way-to-make-a-d3-js-visualisation-layout-responsive

  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height")

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
  // });

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

})
