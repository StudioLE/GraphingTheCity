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

  $scope.infoboxState = 'default'

  $scope.infobox = function(request) {
    return $scope.infoboxState == request
  }

  $scope.wikimediaImage = function(file) {
    file = file.replace(/ /g, '_')
    var hash = md5(file)
    return 'https://upload.wikimedia.org/wikipedia/commons/' + hash.slice(0, 1)  + '/' + hash.slice(0, 2)  + '/' + file
  }

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

  var links = connections

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

    // If the event has a name then it's a place
    if(event.cyTarget._private.data.name) {
      $scope.place = _.find(places, {
        id: event.cyTarget.id()
      })

      $scope.infoboxState = 'place'
    }
    // Else it must be a claim val
    else {
      $scope.claim = data.values[event.cyTarget.id()]

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
