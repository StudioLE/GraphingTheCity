'use strict'

angular.module('app.criteria', ['ngRoute'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/criteria', {
    templateUrl: 'views/criteria.html',
    controller: 'CriteriaCtrl'
  })
}])

/*****************************************************************
*
* CriteriaCtrl controlller
*
******************************************************************/
.controller('CriteriaCtrl', function($scope, $location, Version, Infobox, Criteria, Helper) {

  $scope.defaultCriteria = function() {
    criteria.version = Version.current
    criteria.layout = 'cose-bilkent'
    criteria.properties = [
      // 'P1435', // heritage status
      'P31',   // instance of
      'P149',  // architectural style
      // 'P131',  // located in the administrative territorial entity
      'P84',   // architect
      // 'P1619', // date of official opening
      // 'P571'   // inception
      'P177' // Crosses
    ]
  }

  var criteria = {}

  // Set some defaults if not set
  if( ! Criteria.isset()) {
    $scope.defaultCriteria()
  }
  else {
    /**
     * Get data from local storage
     */
    criteria = Criteria.get()
  }

  $scope.criteria = function() {
    return criteria
  }

  $scope.autocompleteOptions = {
    // componentRestrictions: { country: 'au' },
    types: ['(cities)']
  }

  $scope.step = 1;

  /**
   * Check Stage
   *
   * Show progress
   */
  $scope.checkProgress = function(num) {
    if(num == $scope.step ) {
      return 'active'
    }
    else if (num < $scope.step) {
      return 'complete'
    }
    else {
      return ''
    }
  }

  /**
   * Update data model
   *
   * Called when form is saved
   */
  $scope.saveCriteria = Helper.saveCriteria

  $scope.cities = Helper.storedCities

})
