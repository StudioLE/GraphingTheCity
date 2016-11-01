'use strict'

angular.module('app.static', ['ngRoute', 'jsonFormatter'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    // redirectTo: '/import'
    templateUrl: 'views/ui.html',
    controller: 'HomeCtrl'
  })
  $routeProvider.when('/error', {
    templateUrl: 'views/error.html',
    controller: 'ErrorCtrl'
  })
}])

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

.controller('HomeCtrl', function($location, Node) {
  if(Node.isset()) {
    $location.path('/graph')
  }
  else {
    $location.path('/criteria')
  }
})
