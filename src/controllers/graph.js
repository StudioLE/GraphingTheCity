'use strict'

angular.module('app.graph', ['ngRoute'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/graph', {
    templateUrl: 'views/ui.html',
    controller: 'GraphCtrl'
  })
}])

/*****************************************************************
*
* GraphCtrl controlller
*
******************************************************************/
.controller('GraphCtrl', function($scope, $location, Criteria, Entity, Node, Connection, Data, Helper) {

  /**
   * Get data from local storage
   */
  var criteria = Criteria.get()
  var entities = Entity.get()
  var nodes = Node.get()
  var connections = Connection.get()
  var data = Data.get()

  $scope.criteria = function() {
    return criteria
  }
  $scope.entities = function() {
    return entities
  }
  $scope.data = function() {
    return data
  }
  $scope.place = {}
  $scope.claim = {}
  $scope.connection = {}

  $scope.infoboxState = 'default'

  $scope.infobox = function(request) {
    return $scope.infoboxState == request
  }
  
  $scope.saveCriteria = Helper.saveCriteria
  $scope.wikimediaImage = Helper.wikimediaImage

  var links = connections

  var cy = window.cy = cytoscape({
   container: document.getElementById('interface'),
   // userZoomingEnabled: false,
   // userPanningEnabled: false,
   textureOnViewport: true,
   boxSelectionEnabled: false,
   layout: {
     name: criteria.layout || 'cose' // 'circle' // 'cose-bilkent' 'dagre' 'grid' 'spread'
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

    // If the event is place
    if(event.cyTarget._private.data.type == 'place') {
      $scope.place = entities[event.cyTarget.id()]
      $scope.infoboxState = 'place'
    }
    // Else it must be a claim
    else {
      $scope.claim = entities[event.cyTarget.id()]
      $scope.claim.property = event.cyTarget._private.data.property
      $scope.infoboxState = 'claim'
    }

    $scope.$apply()
  })

  cy.on('mouseover', 'edge', function(event) {
    $scope.connection = {}
    $scope.connection = event.cyTarget.data()
    $scope.infoboxState = 'connection'
    $scope.$apply()
  })

})
