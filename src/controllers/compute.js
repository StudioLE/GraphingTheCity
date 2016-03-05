'use strict'

angular.module('app.compute', ['ngRoute'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/compute', {
    templateUrl: 'views/compute.html',
    controller: 'ComputeCtrl'
  })
}])

/*****************************************************************
*
* ComputeCtrl controller
*
******************************************************************/
.controller('ComputeCtrl', function($scope, Data, Calc) {

  /**
   * Get data from local storage
   */
  var data = Data.get()

  $scope.status = 'Computing'

  var city = data.criteria.city

  var map = new google.maps.Map(document.getElementById('map'), {
    center: city.geometry.location,
    zoom: 13
  })

  var infowindow = new google.maps.InfoWindow()

  var service = new google.maps.places.PlacesService(map)

  var types = _.reduce(data.criteria.types, function(memo, val, key) {
    if (val) memo.push(key)
    return memo
  }, [])

  async.eachSeries(types, function(type, callback) {

    console.log(type)

    $scope.status = 'Locating ' + type
    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
      $scope.$apply()
    }

    service.nearbySearch({
      bounds: city.geometry.viewport,
      type: [type]
    }, function (results, status) {
      console.log(results)
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        if( ! data.places) data.places = []
        data.places = data.places.concat(results)
        Data.set(data)
        callback()
      }
      else {
        // callback(status)
        callback()
      }
    })
  }, function(err) {
    if(err) console.error(err)

    console.log('Complete')

    $scope.status = 'Computation complete'
    $scope.$apply()
  })

})
