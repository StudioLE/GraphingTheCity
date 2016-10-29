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
  if( ! Criteria.isset()) Criteria.set({})
  var criteria = Criteria.get()

  $scope.criteria = function() {
    return criteria
  }

  Infobox.unset()

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

})
