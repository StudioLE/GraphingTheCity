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
.controller('ComputeCtrl', function($scope, $http, $location, Config, Criteria, Place, Connection, Helper) {

  /**
   * Get data from local storage
   */
  var criteria = Criteria.get()
  var places = []

  $scope.status = 'Computing'

  async.waterfall([
    /**
     * Get Places from Knowledge Search API
     */
    function(callback) {
      $http({
        method: 'GET',
        url: 'https://kgsearch.googleapis.com/v1/entities:search?indent=true&prefix=true&types=LandmarksOrHistoricalBuildings&types=TouristAttraction&types=CivicStructure&limit=200&key=' + Config.place_api_key + '&query=' + criteria.city.name
      }).then(function successCallback(response) {
        console.log('Knowledge Graph returned %s results', response.data.itemListElement.length)
        callback(null, response.data.itemListElement)
      }, function errorCallback(response) {
        callback(true, response)
      })
    },
    /**
     * Get coords of Places from Wikipedia API
     */
    function(knowledgeGraph, callback) { 

      var titles = _.map(knowledgeGraph, function(element) {
        return element.result.name
      })

      titles = Helper.formatTitle(titles.join('|'))

      $http({
        method: 'GET',
        // url: 'https://en.wikipedia.org/w/api.php?action=query&prop=coordinates&format=json&origin=*&titles=' + titles
        url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&format=json&languages=en&origin=*&titles=' + titles
      }).then(function successCallback(response) {
        console.log('Wikidata returned %s results', _.keys(response.data.entities).length)
        callback(null, knowledgeGraph, response.data.entities)
      }, function errorCallback(response) {
        callback(true, response)
      })
    },
    /**
     * Associate knowledgeGraph with wikiData
     */
    function(knowledgeGraph, wikiData, callback) { 
      
      var places = {}

      _.each(knowledgeGraph, function(element) {
        if(element.result.name) {
          places[Helper.formatTitle(element.result.name)] = element.result
          places[Helper.formatTitle(element.result.name)].resultScore = element.resultScore
          // places[element.result.name] = {
          //   id: element.result['@id'],
          //   name: element.result.name,
          //   result: element.result,
          //   resultScore: element.resultScore
          // }
        }
        else {
          console.log('Element has no name: ' + element.result['@id'])
        }
      })

      _.each(wikiData, function(element) {
        if( ! element.claims || ! element.claims.P625) {
          console.log('No coords for:', element.title, element)
        }
        else {
          // places[element.sitelinks.enwiki.title].geometry = {
          //   location: element.claims.P625[0].mainsnak.datavalue.value
          // }
          // Formated per http://schema.org/geo
          places[Helper.formatTitle(element.sitelinks.enwiki.title)].geo = {
            '@type': 'GeoCoordinates',
            latitude: element.claims.P625[0].mainsnak.datavalue.value.latitude,
            longitude: element.claims.P625[0].mainsnak.datavalue.value.longitude
          }
          places[Helper.formatTitle(element.sitelinks.enwiki.title)].wikiData = element
        }
      })

      callback(null, places)
    },
    /**
     * Filter out non-local objects
     */
    function(places, callback) {

      var centrePoint = Helper.formatGooglePlaceToSchema(criteria.city.geometry.location)

      callback(null, _.filter(places, function(place) {
        if( ! place.geo) {
          console.log('No .geo for:', place.name, place)
          return false
        }
        else if(Helper.haversineSchema(place.geo, centrePoint) > 5000) {
          console.log('Place out of bounds:', place)
        }
        else {
          return true
        }
      }))

    },
    /**
     * Add to local storage
     */
    function(places, callback) {

      console.log(places)

      Place.set(_.values(places))
      callback(null, places)

    },
    /**
     * Calculate connections
     */
    function(places, callback) {

      var destinations = places
      $scope.status = 'Analysing connections'
      // $scope.$apply()

      var connections = []
      var analysed = []

      async.eachSeries(places, function(place, callback3) {

        $scope.status = 'Analysing ' + place.name
        // $scope.$apply()

        async.eachSeries(destinations, function(destination, callback2) {
          // Skip if place = destination
          if(place['@id'] == destination['@id']) return callback2()
          // Skip if this destination has already been analysed
          if(_.includes(analysed, destination['@id'])) return callback2()

          var distance = Helper.haversineSchema(place.geo, destination.geo)
          if(distance <= criteria.connection.distance) {
            var c = {
              data: {
                id: place['@id'] + '-' + destination['@id'],
                source: place['@id'],
                target: destination['@id']
              }
            }
            connections.push(c)
          }
          callback2()
        }, function(err) {
          if(err) console.error(err)
          analysed.push(place['@id'])
          callback3()
        })

      }, function(err) {
        if(err) console.error(err)
        Connection.set(connections)
        callback(null, places)
      })
    }
  ], function(err, places) {
      if(err) {
        console.error(err)
      }

        $scope.status = 'Computation complete'
        $location.path('/schedule')
        // $scope.$apply()
        // window.location.href = '/#/schedule'
  })

})
