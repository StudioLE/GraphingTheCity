'use strict'

angular.module('app.schedule', ['ngRoute'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/schedule', {
    templateUrl: 'views/schedule.html',
    controller: 'ScheduleCtrl'
  })
}])

/*****************************************************************
*
* ScheduleCtrl controlller
*
******************************************************************/
.controller('ScheduleCtrl', function($scope, Criteria, Entity, Node, Connection, Data, Helper) {

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
      console.log(node)
      if(node.data.type == 'place') {
        return entities[node.data.id]
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
