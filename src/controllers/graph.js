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
  $scope.infoboxClicked = false

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
        'height': 50,
        'width': 50,
        'label': 'data(label)',
        'background-color': 'red',
        'color': '#ffffff',
        'font-size': '10px',
        'text-valign': 'bottom',
        'text-halign': 'right',
        'background-fit': 'cover',
        'border-color': '#fff',
        'border-width': 5,
        'hover-border-width': 8
      }
    },
    {
      selector: 'node.place',
      style: {
        'background-color': '#ff9800',
      }
    },
    {
      selector: 'node.claim',
      style: {
        'background-color': '#001f3f',
      }
    },
    {
      selector: 'edge',
      style: {
        // 'curve-style': 'unbundled-bezier',
        'width': 6,
        'line-color': '#fff',
        'opacity': 1,
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

  var setInfobox = function(event) {
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
  }

  var unsetInfobox = function() {
    $scope.infoboxState = 'default'
    $scope.$apply()
  }

  cy.on('mouseover', 'node', function(event) {
    event.cyTarget.style('border-width', 7)
    event.cyTarget.style('width', 55)
    event.cyTarget.style('height', 55)

    if( ! $scope.infoboxClicked) setInfobox(event)
  })

  cy.on('mouseout', 'node', function(event) {
    event.cyTarget.style('border-width', 5)
    event.cyTarget.style('width', 50)
    event.cyTarget.style('height', 50)

    if( ! $scope.infoboxClicked) unsetInfobox()
  })

  cy.on('click', 'node', function(event) {
    setInfobox(event)
    $scope.infoboxClicked = true
  })

  cy.on('click', function(event) {
    if(event.cyTarget === cy) {
      unsetInfobox()
      $scope.infoboxClicked = false
    }
  })

  cy.on('click', 'edge', function(event) {
    $scope.connection = {}
    $scope.connection = event.cyTarget.data()
    $scope.infoboxState = 'connection'
    $scope.$apply()
  })

})
