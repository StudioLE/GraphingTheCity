'use strict'

angular.module('app.analysis', ['ngRoute'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/analysis', {
    templateUrl: 'views/analysis.html',
    controller: 'AnalysisCtrl'
  })
}])

/*****************************************************************
*
* AnalysisCtrl controlller
*
******************************************************************/
.controller('AnalysisCtrl', function($scope, Criteria, Entity, Node, Connection, Data, Helper) {

  /**
   * Get data from local storage
   */
  var criteria = Criteria.get()
  var entities = Entity.get()
  var nodes = Node.get()
  var connections = Connection.get()
  var data = Data.get()

  $scope.criteria = function() {
    return criteria
  }
  $scope.entities = function() {
    return entities
  }
  $scope.data = function() {
    return data
  }
  $scope.places = function() {
    return _.filter(_.map(nodes, function(node) {
      if(node.data.type == 'place') {
        var place = entities[node.data.id]
        place.sna = node.data.sna
        return place
      }
      else {
        return false
      }
    }))
  }
  $scope.claims = function() {
    return _.filter(_.map(nodes, function(node) {
      if(node.data.type == 'claim') {
        var claim = entities[node.data.id]
        claim.sna = node.data.sna
        return claim
      }
      else {
        return false
      }
    }))
  }
  $scope.place = {}
  $scope.claim = {}
  $scope.connection = {}

  $scope.infoboxState = 'place'
  $scope.infoboxSchedule = true

  $scope.infobox = function(request) {
    return $scope.infoboxState == request
  }

  $scope.wikimediaImage = Helper.wikimediaImage

  $scope.objectLength = function(object) {
    return Object.keys(object).length
  }

})
