'use strict'

angular.module('app.infobox', [])

.controller('InfoboxCtrl', function($rootScope, $scope, $location, Infobox, Criteria, Entity, Node, Connection, Data, Helper) {

  /**
   * Get data from local storage
   */
  // var infobox = Infobox.get()
  var criteria = Criteria.get()
  var entities = Entity.get()

  $scope.infobox = function() {
    // @todo Direct binding doesn't seem right. Investigate..
    return Infobox.get()
  }
  $scope.criteria = function() {
    return criteria
  }
  $scope.entities = function() {
    return entities
  }
  $scope.data = function() {
    // @todo Direct binding doesn't seem right. Investigate..
    return Data.get()
  }

  // Ensure the infobox is populated on first run and on all route changes
  $rootScope.$on("$routeChangeSuccess", function(event, next, current) {
    criteria = Criteria.get()
    Infobox.unset()
  })

  $scope.saveCriteria = Helper.saveCriteria
  $scope.wikimediaImage = Helper.wikimediaImage

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
      url: '#/graph',
      title: 'Graph',
      icon: 'fa-link'
    },
    {
      url: '#/analysis',
      title: 'analysis',
      icon: 'fa-table'
    },
    {
      url: '#/map',
      title: 'Map',
      icon: 'fa-map'
    }
  ]

})