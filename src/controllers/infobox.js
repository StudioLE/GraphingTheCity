'use strict'

angular.module('app.infobox', [])

/*****************************************************************
*
* InfoboxCtrl controlller
*
******************************************************************/
.controller('InfoboxCtrl', function($rootScope, $scope, $location, localStorageService, Version, Infobox, Criteria, Entity, Claim, Node, Connection, Data, Helper) {

  /**
   * Get data from local storage
   */
  var criteria = Criteria.get()

  // Check version of stored data
  if(criteria !== null && ( ! criteria.version || ! semver.satisfies(criteria.version, Version.compatibility))) {
    console.log('Version ' + criteria.version + ' of local storage does not satisfy ' + Version.compatibility + ' so clearing data from local storage')
    localStorageService.clearAll()
  }

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

  $scope.version = Version

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

  var filename = function(append) {
    return 'graphing-the-city-' + $scope.criteria().city.name.replace(/\s+/g, '-').toLowerCase() + append
  }

  $scope.exportJSON = function () {
    // http://stackoverflow.com/questions/16514509/how-do-you-serve-a-file-for-download-with-angularjs-or-javascript
    var json = angular.toJson({
      criteria: Criteria.get(),
      entities: Entity.get(),
      claims: Claim.get(),
      nodes: Node.get(),
      connections: Connection.get(),
      data: Data.get()
    })
    var blob = new Blob([json], { type:"application/json;charset=utf-8;" })
    Helper.downloadFile(filename('.json'), blob)
  }

  $scope.exportCYJS = function() {
    var json = angular.toJson(window.cy.json())
    var blob = new Blob([json], { type:"application/json;charset=utf-8;" })
    Helper.downloadFile(filename('.cyjs'), blob)
  }

  var setBorder = function(colour) {
    cy.startBatch()
    cy.$().style('border-color', colour)
      .style('line-color', colour)
    cy.endBatch()
  }

  $scope.exportPNG = function() {
    // Temporarily set the borders and edges to black so they're visible on a white page
    setBorder('#000')
    var content = window.cy.png({
      full: true
    })
    var blob = Helper.dataURItoBlob(content)
    Helper.downloadFile(filename('.png'), blob)
    setBorder('#fff')
  }

  $scope.exportJPG = function() {
    // Temporarily set the borders and edges to black so they're visible on a white page
    setBorder('#000')
    var content = window.cy.jpg({
      full: true
    })
    var blob = Helper.dataURItoBlob(content)
    Helper.downloadFile(filename('.jpg'), blob)
    setBorder('#fff')
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