'use strict'

/*****************************************************************
*
* Declare app level module which depends on views, and components
*
******************************************************************/
angular.module('app', [
  'ngRoute',
  'ngResource',
  'LocalStorageModule',
  'google.places',
  'app.config',
  'app.static',
  'app.criteria',
  'app.compute',
  'app.schedule',
  'app.graph',
  'app.map',
  'app.analysis',
  'app.raw',
  'app.criteriaFactory',
  'app.entityFactory',
  'app.claimFactory',
  'app.nodeFactory',
  'app.connectionFactory',
  'app.dataFactory',
  'app.helperFactory'
])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/error'})
}])

/*****************************************************************
*
* Lodash
*
******************************************************************/
.constant('_', window._)
