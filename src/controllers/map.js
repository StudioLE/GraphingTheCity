'use strict'

angular.module('app.map', ['ngRoute'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/map', {
    templateUrl: 'views/ui.html',
    controller: 'MapCtrl'
  })
}])

/*****************************************************************
*
* MapCtrl controlller
*
******************************************************************/
.controller('MapCtrl', function($scope, Criteria, Entity, Node, Connection, Data, Helper) {

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
  $scope.place = {}
  $scope.claim = {}
  $scope.connection = {}

  $scope.infoboxState = 'default'

  $scope.infobox = function(request) {
    return $scope.infoboxState == request
  }

  $scope.saveCriteria = Helper.saveCriteria
  $scope.wikimediaImage = Helper.wikimediaImage

  var map_params = {
    style: 'clean_grey',
    zoom: 13,
    marker: {
      size: 5,
      color: '#FF9800'
    }
  }

  var map = new google.maps.Map(document.getElementById('interface'), {
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

  _.each(nodes, function(node){
    if(node.data.type == 'place') {
      var place = node.data
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


        $scope.place = {}
        $scope.claim = {}

        // If the event is place
        $scope.place = entities[place.id]
        $scope.infoboxState = 'place'

        $scope.$apply()


        infowindow.setContent(place.name)
        infowindow.open(map, this)
      })
    }
  })

})
