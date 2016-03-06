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
.controller('RawCtrl', function($scope, Criteria, Place, Connection) {

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
  $scope.connections = function() {
    return connections
  }

})
