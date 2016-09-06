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
.controller('RawCtrl', function($scope, Criteria, Place, Connection, Data) {

  /**
   * Get data from local storage
   */
  var criteria = Criteria.get()
  var places = Place.get()
  var connections = Connection.get()
  var data = Data.get()

  $scope.criteria = function() {
    return criteria
  }
  $scope.places = function() {
    return places
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

  $scope.clearPlace = function() {
    return Place.unset()
  }

  $scope.clearConnection = function() {
    return Connection.unset()
  }

  $scope.clearData = function() {
    return Data.unset()
  }


})
