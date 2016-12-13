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
.controller('CriteriaCtrl', function($scope, $location, Infobox, Criteria, Helper) {

  /**
   * Get data from local storage
   */
  if( ! Criteria.isset()){
    // Set some defaults if not set
    Criteria.set({
      layout: 'cose-bilkent',
      properties: [
        // 'P1435', // heritage status
        'P31',   // instance of
        'P149',  // architectural style
        // 'P131',  // located in the administrative territorial entity
        'P84',   // architect
        // 'P1619', // date of official opening
        // 'P571'   // inception
        'P177' // Crosses
      ]
    })
  }
  var criteria = Criteria.get()

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

  $scope.cities = {
    london: 'London',
    paris: 'Paris',
    berlin: 'Berlin',
    tokyo: 'Tokyo',
    barcelona: 'Barcelona',
    venice: 'Venice',
    vienna: 'Vienna'
  }

})
