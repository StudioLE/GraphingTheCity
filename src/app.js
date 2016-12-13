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
  'angulartics',
  'angulartics.google.analytics',
  'google.places',
  'ngTagsInput',
  'app.config',
  'app.static',
  'app.infobox',
  'app.criteria',
  'app.load',
  'app.compute',
  'app.schedule',
  'app.graph',
  'app.map',
  'app.analysis',
  'app.raw',
  'app.infoboxFactory',
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
