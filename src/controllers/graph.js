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
.controller('GraphCtrl', function($scope, Data) {

  /**
   * Get data from local storage
   */
  var data = Data.get()
  $scope.data = function() {
    return data
  }

  var nodes = _.map(data.schedule, function(s, key) {
    return {
      data: {
        id: key,
        label: key
      },
      classes: 'bg-' + s.colour,
      // selected: true,
      // selectable: true,
      // locked: true,
      // grabbable: true
    }
  })

  var edges = _.map(data.adjacencies, function(a, key) {
    return {
      data: {
        id: 'adjacency' + key,
        source: a.source,
        target: a.target
      }
    }
  })

  var cy = cytoscape({
    container: document.getElementById('cy'),
    userZoomingEnabled: false,
    userPanningEnabled: false,
    textureOnViewport: true,
    boxSelectionEnabled: false,
    layout: {
      name: 'breadthfirst'
    },
    elements: {
      nodes: nodes,
      edges: edges
    },
    style: [
      {
        selector: 'node',
        style: {
          'height': 40,
          'width': 40,
          'background-color': '#ccc',
          'label': 'data(label)'
        }
      }
    ],
  })

  cy.style('node {height:40;width:80;shape:rectangle;background-color:#ccc;label:data(label);text-valign:center;text-halign:center;color:#fff;}edge{width:3;}.bg-navy{background-color:#001F3F;}.bg-blue{background-color:#0074D9;}.bg-aqua{background-color:#7FDBFF;}.bg-teal{background-color:#39CCCC;}.bg-olive{background-color:#3D9970;}.bg-green{background-color:#2ECC40;}.bg-lime{background-color:#01FF70;}.bg-yellow{background-color:#FFDC00;}.bg-orange{background-color:#FF851B;}.bg-red{background-color:#FF4136;}.bg-fuchsia{background-color:#F012BE;}.bg-purple{background-color:#B10DC9;}.bg-maroon{background-color:#85144B;}.bg-white{background-color:#fff;}.bg-gray{background-color:#aaa;}.bg-silver{background-color:#ddd;}.bg-black{background-color:#111;}')

})
