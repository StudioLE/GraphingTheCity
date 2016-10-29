'use strict'

angular.module('app.infobox', [])

.controller('InfoboxCtrl', function($scope, Infobox, Criteria, Entity, Node, Connection, Data, Helper) {

  /**
   * Get data from local storage
   */
  // var infobox = Infobox.get()
  var criteria = Criteria.get()
  var entities = Entity.get()
  var nodes = Node.get()
  var connections = Connection.get()
  var data = Data.get()

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
    return data
  }

  $scope.saveCriteria = Helper.saveCriteria
  $scope.wikimediaImage = Helper.wikimediaImage


  ////////////////////////////



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