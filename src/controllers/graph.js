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
.controller('GraphCtrl', function($scope, Infobox, Criteria, Entity, Node, Connection, Data) {

  /**
   * Get data from local storage
   */
  var criteria = Criteria.get()
  var entities = Entity.get()
  var nodes = Node.get()
  var connections = Connection.get()
  var data = Data.get()

  $scope.infoboxClicked = false

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

  var calculateSNA = function() {
    // Don't run if already set...
    if(data.sna) return false
    console.log('Running SNA')
    var dcn = cy.$().dcn()
    var ccn = cy.$().ccn()
    var bc = cy.$().bc()

    _.map(nodes, function(node) {
      node.data.sna  = {
        degreeCentrality: dcn.degree('#' + node.data.id),
        closenessCentrality: ccn.closeness('#' + node.data.id),
        betweennessCentrality: bc.betweenness('#' + node.data.id)
      }
      return node
    })

    // Add SNA data to local storage
    Data.add({
      sna: true
    })
    Node.set(nodes)

    console.log('SNA complete')
  }

  var setInfobox = function(event) {

    // If the event is place
    if(event.cyTarget._private.data.type == 'place') {
      var place = entities[event.cyTarget.id()]
      place.sna = event.cyTarget.data('sna')
      Infobox.set('place', place)
    }
    // Else it must be a claim
    else {
      var claim = entities[event.cyTarget.id()]
      // If we can't find the claim in entities it's probably due to the local storage being full
      // This is a temporary workaround to surpress errors
      // @todo Look into alternative storage options
      if( ! claim) {
        console.error(event.cyTarget.id() + ' not found in entities')
        claim = {
          id: event.cyTarget.id()
        }
      }
      claim.sna = event.cyTarget.data('sna')
      claim.property = event.cyTarget._private.data.property
      Infobox.set('claim', claim)
    }

    $scope.$apply()
  }

  var unsetInfobox = function() {
    Infobox.unset()
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
    Infobox.set('connection', event.cyTarget.data())
    $scope.$apply()
  })

  cy.ready(function(event) {
    console.log('cy.ready()')
    calculateSNA()
  })

})
