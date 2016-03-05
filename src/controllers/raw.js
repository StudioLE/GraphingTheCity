'use strict'

angular.module('app.raw', ['ngRoute'])

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
.controller('RawCtrl', function($scope, Criteria, Place) {

  /**
   * Get data from local storage
   */
  var criteria = Criteria.get()
  var places = Place.get()

  $scope.criteria = function() {
    return criteria
  }
  $scope.places = function() {
    return places
  }

})
