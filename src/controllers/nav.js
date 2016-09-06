'use strict'

angular.module('nav', [])

.controller('NavCtrl', function($scope, $location, Criteria, Place, Connection, Data, Config) {
  $scope.navClass = function(href) {
    return href === '#' + $location.path() ? 'active' : ''
  }

  $scope.nav = [
    {
      url: '#/criteria',
      title: 'Criteria',
      icon: 'fa-edit',
      if: true
    },
    {
      url: '#/schedule',
      title: 'Schedule',
      icon: 'fa-table'
    },
    {
      url: '#/map',
      title: 'Map',
      icon: 'fa-map'
    },
    {
      url: '#/graph',
      title: 'Graph',
      icon: 'fa-link'
    }
  ]

  $scope.navView = function() {
    return 'views/nav.html'
  }

  $scope.clearData = function() {
    $location.path('/criteria')
    Connection.unset()
    Data.unset()
    return Place.unset()
  }

  $scope.placeIsSet = function() {
    return Place.isset()
  }

  $scope.criteriaIsSet = function() {
    return Criteria.isset()
  }

})
