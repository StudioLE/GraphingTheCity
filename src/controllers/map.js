'use strict'

angular.module('app.map', ['ngRoute'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/map', {
    templateUrl: 'views/map.html',
    controller: 'MapCtrl'
  })
}])

/*****************************************************************
*
* MapCtrl controlller
*
******************************************************************/
.controller('MapCtrl', function($scope, Criteria, Place) {

  /**
   * Get data from local storage
   */
  var criteria = Criteria.get()
  var places = Place.get()

  $scope.criteria = function() {
    return criteria
  }
  $scope.places = function() {
    return places
  }

  var map = new google.maps.Map(document.getElementById('map'), {
    center: criteria.city.geometry.location,
    zoom: 13
  })

  var infowindow = new google.maps.InfoWindow()

  _.each(places, function(place){
    if(place.geo) {
      var marker = new google.maps.Marker({
        map: map,
        position: {
          lat: place.geo.latitude,
          lng: place.geo.longitude
        }
      })

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name)
        infowindow.open(map, this)
      })
    }
  })

})
