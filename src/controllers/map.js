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
  // if( ! Data.isset()) Sample.set()
  var data = Data.get()
  $scope.data = function() {
    return data
  }


  // service = new google.maps.places.PlacesService(map)
  // service.nearbySearch(request, callback)

  var map;
  var infowindow;

  function initMap() {
    // var ncl = {lat: -33.867, lng: 151.195};

    var city = data.criteria.city

    map = new google.maps.Map(document.getElementById('map'), {
      center: city.geometry.location,
      zoom: 13
    });

    infowindow = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(map)

    var types = _.reduce(data.criteria.types, function(memo, val, key) {
        if (val) memo.push(key)
        return memo
      }, [])

    console.log(types)

    service.nearbySearch({
      bounds: city.geometry.viewport,
      type: ['train_station']
    }, function (results, status) {
      console.log(results)
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // for (var i = 0; i < results.length; i++) {
        //   createMarker(results[i]);
        // }
        if( ! data.places) data.places = []
        data.places = data.places.concat(results)
        Data.set(data)
      }
    })
  }


  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }


  initMap()

  

})
