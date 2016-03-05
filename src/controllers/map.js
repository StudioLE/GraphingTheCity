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
.controller('MapCtrl', function($scope, Data, Calc) {

  /**
   * Get data from local storage
   */
  var data = Data.get()
  $scope.data = function() {
    return data
  }

  var city = data.criteria.city

  var map = new google.maps.Map(document.getElementById('map'), {
    center: city.geometry.location,
    zoom: 13
  })

  var infowindow = new google.maps.InfoWindow()

  _.each(data.places, function(place){
    var placeLoc = place.geometry.location
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    })

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name)
      infowindow.open(map, this)
    })
  })

})
