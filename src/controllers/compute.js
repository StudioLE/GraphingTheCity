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
.controller('ComputeCtrl', function($scope, $location, Criteria, Place, Connection, Calc) {

  /**
   * Get data from local storage
   */
  var criteria = Criteria.get()
  var places = []

  $scope.status = 'Computing'

  var map = new google.maps.Map(document.getElementById('map'), {
    center: criteria.city.geometry.location,
    zoom: 13
  })

  var infowindow = new google.maps.InfoWindow()

  var service = new google.maps.places.PlacesService(map)

  var types = _.reduce(criteria.types, function(memo, val, key) {
    if (val) memo.push(key)
    return memo
  }, [])

  async.eachSeries(types, function(type, callback) {

    // console.log(type)

    $scope.status = 'Locating ' + type
    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
      $scope.$apply()
    }

    service.nearbySearch({
      bounds: criteria.city.geometry.viewport,
      type: [type]
    }, function (results, status) {
      // console.log(results)
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        places = places.concat(results)
        Place.set(places)
        callback()
      }
      else {
        // callback(status)
        callback()
      }
    })
  }, function(err) {
    if(err) console.error(err)

    calculateConnections(places)
  })

  var calculateConnections = function(places) {
    var destinations = places
    // console.log('Analysing connections')
    $scope.status = 'Analysing connections'
    $scope.$apply()

    var connections = []
    var analysed = []

    async.eachSeries(places, function(place, callback) {

      $scope.status = 'Analysing ' + place.name
      $scope.$apply()

      // destinations.shift()
      // console.log(place.name)
      // console.log(destinations)

      async.eachSeries(destinations, function(destination, callback2) {
        // Skip if place = destination
        if(place.id == destination.id) return callback2()
        // Skip if this destination has already been analysed
        if(_.includes(analysed, destination.id)) return callback2()

        var distance = Calc.haversinePlaces(place, destination)
        // console.log(distance)
        if(distance <= criteria.connection.distance) {
          var c = {
            data: {
              id: place.id + '-' + destination.id,
              source: place.id,
              target: destination.id
            }
          }
          connections.push(c)
        }
        callback2()
      }, function(err) {
        if(err) console.error(err)
        analysed.push(place.id)
        callback()
      })

    }, function(err) {
      if(err) console.error(err)

      Connection.set(connections)

      $scope.status = 'Computation complete'
      $location.path('/schedule')
      $scope.$apply()
      // window.location.href = '/#/schedule'

    })

  }

})
