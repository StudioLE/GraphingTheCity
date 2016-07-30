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

  var map_params = {
    style: 'clean_grey',
    zoom: 13,
    marker: {
      size: 5,
      color: '#FF9800'
    }
  }

  var map = new google.maps.Map(document.getElementById('map'), {
    center: criteria.city.geometry.location,
    zoom: map_params.zoom
  })

  // https://snazzymaps.com/style/102/clean-grey
  var cleanGrey = new google.maps.StyledMapType([
    {"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#e3e3e3"}]},{"featureType":"landscape.natural","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"color":"#cccccc"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#FFFFFF"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]}
  ])

  map.mapTypes.set(map_params.style, cleanGrey)
  map.setMapTypeId(map_params.style)

  var infowindow = new google.maps.InfoWindow()

  _.each(places, function(place){
    if(place.geo) {
      var marker = new google.maps.Marker({
        map: map,
        position: {
          lat: place.geo.latitude,
          lng: place.geo.longitude
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          // scale: 5,
          scale: map_params.marker.size,
          fillOpacity: 0.5,
          fillColor: map_params.marker.color,
          strokeOpacity: 0
        }
      })

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name)
        infowindow.open(map, this)
      })
    }
  })

})
