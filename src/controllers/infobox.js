'use strict'

angular.module('app.infobox', [])

/*****************************************************************
*
* InfoboxCtrl controlller
*
******************************************************************/
.controller('InfoboxCtrl', function($rootScope, $scope, $location, Infobox, Criteria, Entity, Claim, Node, Connection, Data, Helper) {

  /**
   * Get data from local storage
   */
  var criteria = Criteria.get()

  // @todo Direct binding doesn't seem right. Investigate..
  $scope.infobox = function() {
    return Infobox.get()
  }
  $scope.criteria = function() {
    return criteria
  }
  $scope.entities = function() {
    return Entity.get()
  }
  $scope.data = function() {
    return Data.get()
  }

  // Ensure the infobox is populated on first run and on all route changes
  $rootScope.$on("$routeChangeSuccess", function(event, next, current) {
    criteria = Criteria.get()
    Infobox.unset()
  })

  if(Criteria.isset()) {
    $scope.chosen_claims = _.map(criteria.properties, function(prop) {
      return prop.text
    })
  }

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


  // http://stackoverflow.com/questions/4391575/how-to-find-the-size-of-localstorage#comment34769723_15720835
  $scope.storage = function() {
    var t = 0;
    for(var x in localStorage) {
      t += (((localStorage[x].length * 2)))
    }
    var used = (t / 1024)
    return {
      used: used.toFixed(2) + ' KB',
      // @todo We're making the assumption that 10,000 KB is the localStorage limit. Investigate more accurate solutions.
      percent: '~' + (used / 10000 * 100).toFixed(2) + '%'
    }
  }

})