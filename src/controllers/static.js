'use strict'

angular.module('app.static', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    // redirectTo: '/import'
    templateUrl: 'views/home.html',
    controller: 'HomeCtrl'
  })
  $routeProvider.when('/404', {
    templateUrl: 'views/404.html',
    controller: 'StaticCtrl'
  })
}])

.controller('StaticCtrl', function() {
})

.controller('HomeCtrl', function(Data) {
  if(Data.isset()) {
    window.location.href = '/#/map'
  }
  else {
    window.location.href = '/#/criteria'
  }
})
