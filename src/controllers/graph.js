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
.controller('GraphCtrl', function($scope, $location, Criteria, Place, Connection, Data) {

  /**
   * Get data from local storage
   */
  var criteria = Criteria.get()
  var places = Place.get()
  var connections = Connection.get()
  var data = Data.get()
  // var card = places[0]

  $scope.criteria = function() {
    return criteria
  }
  $scope.places = function() {
    return places
  }
  $scope.data = function() {
    return data
  }
  $scope.place = {}
  $scope.claim = {}
  $scope.connection = {}
  $scope.showPlace = false
  $scope.showConnection = false

  var nodes = _.map(places, function(place) {
    return {
      data: {
        id: place.id,
        name: place.name
        // classes: 'bg-blue',
        // selected: true,
        // selectable: true,
        // locked: true,
        // grabbable: true
      }
    }
  })


  nodes = nodes.concat(_.map(data.values, function(val) {
    return {
      data: {
        id: val.id,
        title: val.id
        // classes: 'bg-blue',
        // selected: true,
        // selectable: true,
        // locked: true,
        // grabbable: true
      }
    }
  }))
  console.log(nodes)

  // Cytoscape had a 'data' sub object, d3 does not so lets convert
  // var links = _.map(connections, function(link) {
  //   // return link.data
  //   return link.data
  // })

  var links = connections

  console.log(nodes)

  console.log(links)

  // d3 graph example from: https://bl.ocks.org/mbostock/4062045
  // d3 responsive viewport: http://stackoverflow.com/questions/9400615/whats-the-best-way-to-make-a-d3-js-visualisation-layout-responsive

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


  $scope.changeLayout = function() {
   Criteria.set($scope.criteria())
   cy.layout({
     name: $scope.criteria().layout
   })
  }


  cy.on('mouseover', 'node', function(event) {
    $scope.place = {}
    $scope.claim = {}
    $scope.showConnection = false
      $scope.showClaim = false
      $scope.showPlace = false

    // If the event has a name then it's a place
    if(event.cyTarget._private.data.name) {
      $scope.place = _.find(places, {
        id: event.cyTarget.id()
      })

      $scope.showPlace = true
    }
    // Else it must be a claim val
    else {
      $scope.claim = data.values[event.cyTarget.id()]

      $scope.showClaim = true
    }
    
    $scope.$apply()
  })

  cy.on('mouseover', 'edge', function(event) {
    $scope.connection = {}
    $scope.connection = event.cyTarget.data()
    $scope.showPlace = false
    $scope.showClaim = false
    $scope.showConnection = true
    $scope.$apply()
  })

})
