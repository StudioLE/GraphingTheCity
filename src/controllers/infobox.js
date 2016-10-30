'use strict'

angular.module('app.infobox', [])

.controller('InfoboxCtrl', function($rootScope, $scope, $location, Infobox, Criteria, Entity, Claim, Node, Connection, Data, Helper) {

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

  $scope.export = function () {
    // http://stackoverflow.com/questions/16514509/how-do-you-serve-a-file-for-download-with-angularjs-or-javascript
    $scope.toJSON = '';
    $scope.toJSON = angular.toJson({
      criteria: Criteria.get(),
      entities: Entity.get(),
      claims: Claim.get(),
      nodes: Node.get(),
      connections: Connection.get(),
      data: Data.get()
    })
    var blob = new Blob([$scope.toJSON], { type:"application/json;charset=utf-8;" })
    var downloadLink = angular.element('<a></a>')
    downloadLink.attr('href', window.URL.createObjectURL(blob))
    downloadLink.attr('download', 'graphing-the-city-' + $scope.criteria().city.name.replace(/\s+/g, '-').toLowerCase() + '.json')
    downloadLink[0].click();
  }

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