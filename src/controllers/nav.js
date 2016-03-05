'use strict'

angular.module('nav', [])

.controller('NavCtrl', function($scope, $location, Criteria, Place, Config) {
  $scope.navClass = function(href) {
    return href === '#' + $location.path() ? 'active' : ''
  }

  $scope.nav = [
    {
      url: '#/criteria',
      title: 'Criteria',
      icon: 'fa-edit'
    },
    {
      url: '#/schedule',
      title: 'Schedule',
      icon: 'fa-table'
    },
    {
      url: '#/graph',
      title: 'Graph',
      icon: 'fa-link'
    },
    {
      url: '#/map',
      title: 'Map',
      icon: 'fa-map'
    }
  ]

  $scope.navView = function() {
    return 'views/nav.html'
  }

  $scope.clearData = function() {
    window.location.href = '/#/criteria'
    return Place.unset()
  }

  $scope.dataIsSet = function() {
    return Criteria.isset()
  }

})
