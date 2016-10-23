'use strict'

angular.module('app.raw', ['ngRoute', 'jsonFormatter'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/raw', {
    templateUrl: 'views/raw.html',
    controller: 'RawCtrl'
  })
}])

/*****************************************************************
*
* RawCtrl controlller
*
******************************************************************/
.controller('RawCtrl', function($scope, Criteria, Entity, Claim, Node, Connection, Data) {

  /**
   * Get data from local storage
   */
  var criteria = Criteria.get()
  var entities = Entity.get()
  var claims = Claim.get()
  var nodes = Node.get()
  var connections = Connection.get()
  var data = Data.get()

  $scope.criteria = function() {
    return criteria
  }
  $scope.entities = function() {
    return entities
  }
  $scope.claims = function() {
    return claims
  }
  $scope.nodes = function() {
    return nodes
  }
  $scope.connections = function() {
    return connections
  }
  $scope.data = function() {
    return data
  }

  $scope.clearCriteria = function() {
    return Criteria.unset()
  }

  $scope.clearEntities = function() {
    return Entity.unset()
  }

  $scope.clearClaims = function() {
    return Claim.unset()
  }

  $scope.clearNodes = function() {
    return Node.unset()
  }

  $scope.clearConnection = function() {
    return Connection.unset()
  }

  $scope.clearData = function() {
    return Data.unset()
  }

})
