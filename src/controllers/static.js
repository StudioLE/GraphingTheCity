'use strict'

angular.module('app.static', ['ngRoute', 'jsonFormatter'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/ui.html',
    controller: 'HomeCtrl'
  })
  $routeProvider.when('/error', {
    templateUrl: 'views/error.html',
    controller: 'ErrorCtrl'
  })
}])


/*****************************************************************
*
* ErrorCtrl controlller
*
******************************************************************/
.controller('ErrorCtrl', function($window, $location, $scope, Data) {

  /**
   * Get data from local storage
   */
  var data = Data.get()
  $scope.data = function() {
    return data
  }

  $scope.restart = function() {
    $location.path('/criteria')
    $window.location.reload()
  }
})

/*****************************************************************
*
* HomeCtrl controlller
*
******************************************************************/
.controller('HomeCtrl', function($location, Node) {
  if(Node.isset()) {
    $location.path('/graph')
  }
  else {
    $location.path('/criteria')
  }
})
