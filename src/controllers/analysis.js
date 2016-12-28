'use strict'

angular.module('app.analysis', ['ngRoute'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/analysis', {
    templateUrl: 'views/analysis.html',
    controller: 'AnalysisCtrl'
  })
}])

/*****************************************************************
*
* AnalysisCtrl controlller
*
******************************************************************/
.controller('AnalysisCtrl', function($scope, $location, Infobox, Criteria, Entity, Node, Connection, Data, Helper) {

  /**
   * Get data from local storage
   */
  var criteria = Criteria.get()
  var entities = Entity.get()
  var nodes = Node.get()
  var connections = Connection.get()
  var data = Data.get()

  /**
   * Redirect if no criteria
   */
  if( ! criteria) return $location.path('/criteria')

  $scope.criteria = function() {
    return criteria
  }
  $scope.entities = function() {
    return entities
  }
  $scope.data = function() {
    return data
  }
  $scope.places = function() {
    return _.filter(_.map(nodes, function(node) {
      if(node.data.type == 'place') {
        var place = entities[node.data.id]
        place.sna = node.data.sna
        return place
      }
      else {
        return false
      }
    }))
  }
  $scope.claims = function() {
    return _.filter(_.map(nodes, function(node) {
      if(node.data.type == 'claim') {
        var claim = entities[node.data.id]
        // If we can't find the claim in entities it's probably due to the local storage being full
        // This is a temporary workaround to surpress errors
        // @todo Look into alternative storage options
        if( ! claim) {
          console.error(node.data.id + ' not found in entities')
          claim = {
            id: node.data.id
          }
        }
        claim.sna = node.data.sna
        claim.property = node.data.property
        // @todo Claim node could be used for more than one property! How do we deal with this scenario?
        return claim
      }
      else {
        return false
      }
    }))
  }

  $scope.sortType = 'sna.degreeCentrality'
  $scope.sortReverse = true

})
