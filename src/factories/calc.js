'use strict'

angular.module('app.calcFactory', [])

/*****************************************************************
*
* Calc factory
*
******************************************************************/
.factory('Calc', function() {
return {

  latLng: function(location) {
    return location.lat + ',' + location.lng
  },
  
  /**
   * Radius of city by compass lat,lng bounds
   *
   * Using the haversine formula:
   * http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
   */
  latLngRadius: function(bounds) {
    return this.haversine(bounds.north, bounds.west, bounds.south, bounds.east)
  },

  /**
   * Haversine formula between Google Places
   *
   * http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
   */
  haversinePlaces: function(place1, place2) {
    var lat1 = place1.geometry.location.lat()
    var lon1 = place1.geometry.location.lng()
    var lat2 = place2.geometry.location.lat()
    var lon2 = place2.geometry.location.lng()
    return this.haversine(lat1, lon1, lat2, lon2)
  },

  /**
   * Haversine formula:
   *
   * http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
   */
  haversine: function(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1)  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1)
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c // Distance in km
    return d * 1000 // Distance in m
  },

  deg2rad: function(deg) {
    return deg * (Math.PI/180)
  }
    
}
})
