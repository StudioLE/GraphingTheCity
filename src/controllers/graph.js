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
.controller('GraphCtrl', function($scope, $location, Criteria, Place, Connection, Calc) {

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
      data: {
        id: place.id,
        label: place.name
      },
      // classes: 'bg-blue',
      // selected: true,
      // selectable: true,
      // locked: true,
      // grabbable: true
    }
  })

  var cy = window.cy = cytoscape({
    container: document.getElementById('cy'),
    // userZoomingEnabled: false,
    // userPanningEnabled: false,
    textureOnViewport: true,
    boxSelectionEnabled: false,
    layout: {
      name: criteria.layout || 'circle' // 'circle' // 'cose-bilkent' 'dagre' 'grid' 'spread'
    },
    elements: {
      nodes: nodes,
      edges: connections
    },
    style: [
      {
        selector: 'node',
        style: {
          // 'height': 40,
          // 'width': 40,
          'label': 'data(label)',
          'background-color': '#FF9800',
          'color': '#ffffff',
          'font-size': '10px',
          'text-valign': 'bottom',
          'text-halign': 'right',
        }
      },

      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#FF9800'
        }
      }
    ],
  })

  // cy.style('node {height:40;width:80;shape:rectangle;background-color:#ccc;label:data(label);text-valign:center;text-halign:center;color:#fff;}edge{width:3;}.bg-navy{background-color:#001F3F;}.bg-blue{background-color:#0074D9;}.bg-aqua{background-color:#7FDBFF;}.bg-teal{background-color:#39CCCC;}.bg-olive{background-color:#3D9970;}.bg-green{background-color:#2ECC40;}.bg-lime{background-color:#01FF70;}.bg-yellow{background-color:#FFDC00;}.bg-orange{background-color:#FF851B;}.bg-red{background-color:#FF4136;}.bg-fuchsia{background-color:#F012BE;}.bg-purple{background-color:#B10DC9;}.bg-maroon{background-color:#85144B;}.bg-white{background-color:#fff;}.bg-gray{background-color:#aaa;}.bg-silver{background-color:#ddd;}.bg-black{background-color:#111;}')
  // $scope.layout = 'cose'
  $scope.changeLayout = function() {
    Criteria.set($scope.criteria())
    cy.layout({
      name: $scope.criteria().layout
    })
  }

  $scope.export = function() {
    var content = JSON.stringify(cy.json())

    window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, saveJSON);

    function saveJSON(localstorage) {
      localstorage.root.getFile('citygraph.json', {create: true}, function(DatFile) {
        DatFile.createWriter(function(DatContent) {
          var blob = new Blob([content], {type: "text/json"})
          DatContent.write(blob)
        })
      })
    }

  }

  $scope.savePNG = function() {
    var content = cy.png({
      full: true
    })

    // $scope.pngSrc = content

    // $location.path(content)

    window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, savePNGFile);

    function savePNGFile(localstorage) {
      localstorage.root.getFile('citygraph.png', {create: true}, function(DatFile) {
        DatFile.createWriter(function(DatContent) {
          var blob = new Blob([content], {type: "image/png"})
          DatContent.write(blob)
        })
      })
    }

  }

  $scope.pngSrc = ''

})
