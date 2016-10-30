'use strict'

angular.module('app.load', ['ngRoute'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/load/:city', {
    templateUrl: 'views/ui.html',
    controller: 'LoadCtrl'
  })
}])

/*****************************************************************
*
* LoadCtrl controlller
*
******************************************************************/
.controller('LoadCtrl', function($scope, $location, $route, $http, Infobox, Criteria, Entity, Claim, Node, Connection, Data, Helper) {

  $http({
    method: 'GET',
    url: 'data/' + $route.current.params.city + '.json'
  }).then(function successCallback(response) {
    Criteria.set(response.data.criteria)
    Entity.set(response.data.entities)
    Claim.set(response.data.claims)
    Node.set(response.data.nodes)
    Connection.set(response.data.connections)
    Data.set(response.data.data)
    $location.path('/graph')
  }, function errorCallback(response) {
    Data.add({
      error: response
    })
    $location.path('/error')
    return console.error(response)
  })

})
