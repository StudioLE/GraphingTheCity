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
.controller('ComputeCtrl', function($scope, $http, $location, Config, Criteria, Place, Connection, Data, Helper) {

  /**
   * Get data from local storage
   */
  var criteria = Criteria.get()
  var places = []
  // var metadata = Data.get()
  var metadata = {}

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

      // Create an array of all place names from Knowledge Graph data
      var titles = _.map(knowledgeGraph, function(element) {
        return element.result.name
      })

      // console.log(titles)

      // Reset all counts
      metadata.count = {
        out_of_bounds: 0,
        no_geo: 0,
        no_name: 0,
        no_match: 0
      }

      // Count Knowledge Graph results
      metadata.count.knowledgegraph = knowledgeGraph.length

      // Wikidata API will only return 50 results so we divide the titles into chunks for separate queries
      async.concat(_.chunk(titles, 50), function(titles, concatCallback) {

        // Create a string from the titles
        titles = Helper.urlencodeTitle(titles.join('|'))

        $http({
          method: 'GET',
          // url: 'https://en.wikipedia.org/w/api.php?action=query&prop=coordinates&format=json&origin=*&titles=' + titles
          url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&format=json&languages=en&origin=*&titles=' + titles
        }).then(function successCallback(response) {
          console.log('Wikidata returned %s places', _.keys(response.data.entities).length)
          // async.concat only works with arrays so convert data to array
          concatCallback(null, _.values(response.data.entities))
        }, function errorCallback(response) {
          concatCallback(true, response)
        })

      }, function(err, results) {
        if(err) return callback(err, results)
        callback(null, knowledgeGraph, results)
      })
    },
    /**
     * Associate knowledgeGraph with wikidata
     */
    function(knowledgeGraph, wikidata, callback) {
      
      var places = {}

      // Count wikidata results
      metadata.count.wikidata = wikidata.length

      // Convert wikidata array to object
      wikidata = _.keyBy(wikidata, 'title')

      // Create a places object entry for each Knowledge Graph Place
      _.each(knowledgeGraph, function(element) {
        // Do not include if it has no name
        if( ! element.result.name) {
          console.log('Element has no name: ' + element.result['@id'])
          metadata.count.no_name ++
        }
        else {
          places[Helper.formatName(element.result.name)] = element.result
          places[Helper.formatName(element.result.name)].resultScore = element.resultScore
        }
      })

      // Go through the wikidata and add id, .geo and .wikidata to places entry
      _.each(wikidata, function(element) {
        // Skip if no coords, we will filter them out later
        if( ! element.claims || ! element.claims.P625) {
          // console.log('No coords for:', element.title, element)
        }
        // Skip if no match
        else if( ! places[Helper.formatName(element.sitelinks.enwiki.title)]) {
          console.log('No place in object:', Helper.formatName(element.sitelinks.enwiki.title))
          metadata.count.no_match ++
        }
        else {
          // Add wikidata place id
          places[Helper.formatName(element.sitelinks.enwiki.title)].id = element.id
          // Formated per http://schema.org/geo
          places[Helper.formatName(element.sitelinks.enwiki.title)].geo = {
            '@type': 'GeoCoordinates',
            latitude: element.claims.P625[0].mainsnak.datavalue.value.latitude,
            longitude: element.claims.P625[0].mainsnak.datavalue.value.longitude
          }
          places[Helper.formatName(element.sitelinks.enwiki.title)].wikidata = element
        }
      })

      callback(null, places)
    },
    /**
     * Filter out non-local objects
     */
    function(places, callback) {

      var centrePoint = Helper.formatGooglePlaceToSchema(criteria.city.geometry.location)

      // Filter out places that do not work
      callback(null, _.filter(places, function(place) {
        if( ! place.geo) {
          // console.log('No .geo for:', place.name, place)
          metadata.count.no_geo ++
          return false
        }
        // @todo use criteria.city.geometry.viewport as bounds instead
        else if(Helper.haversineSchema(place.geo, centrePoint) > 5000) {
          // console.log('Place out of bounds:', place)
          metadata.count.out_of_bounds ++
          return false
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

      // console.log(places)

      metadata.count.places = places.length

      Place.set(_.values(places))
      // Data.set(metadata)
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
      var claims = {}

      async.eachSeries(places, function(place, callback_places_series) {

        $scope.status = 'Analysing ' + place.name
        // $scope.$apply()

        // Add each of this place's claims to the claims object
        _.each(place.wikidata.claims, function(claim, claim_id) {
          // If this is the first of claim type then add to object
          if( ! claims[claim_id]) claims[claim_id] = {}
          // Add claim to claims
          claims[claim_id][place.id] = claim
        })

        // Connect by distance deprecated so skip
        return callback_places_series()

        // Go through each destination and compare it with this place
        async.eachSeries(destinations, function(destination, callback_destinations_series) {
          // Skip if place = destination
          if(place.id == destination.id) return callback_destinations_series()
          // Skip if this destination has already been analysed
          if(_.includes(analysed, destination.id)) return callback_destinations_series()

          var distance = Helper.haversineSchema(place.geo, destination.geo)
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
          callback_destinations_series()
        }, function(err) {
          if(err) console.error(err)
          analysed.push(place.id)
          callback_places_series()
        }) // end of destination series

      }, function(err) {
        if(err) console.error(err)
        metadata.claims = claims
        // Data.set(metadata)
        Connection.set(connections)
        callback(null, places)
      }) // end of places series
    },
    /**
     * Get information on all claims
     */
    function(places, callback) {

      var claim_ids = _.keys(metadata.claims)

      // console.log(claim_ids)

      // Wikidata API will only return 50 results so we divide the titles into chunks for separate queries
      async.concat(_.chunk(claim_ids, 50), function(titles, concatCallback) {

        // Create a string from the ids
        claim_ids = claim_ids.join('|')

        $http({
          method: 'GET',
          // url: 'https://en.wikipedia.org/w/api.php?action=query&prop=coordinates&format=json&origin=*&titles=' + titles
          // url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&format=json&languages=en&origin=*&titles=' + titles
          url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&format=json&languages=en&origin=*&ids=' + claim_ids
        }).then(function successCallback(response) {
          console.log('Wikidata returned %s properties', _.keys(response.data.entities).length)
          // async.concat only works with arrays so convert data to array
          concatCallback(null, _.values(response.data.entities))
        }, function errorCallback(response) {
          concatCallback(true, response)
        })

      }, function(err, results) {
        if(err) return callback(err, results)
        
        // Convert wikidata array to object
        metadata.properties = _.keyBy(results, 'id')

        Data.set(metadata)
        callback(null, places)
        // callback(null, knowledgeGraph, results)
      })

    },
    /**
     * Calculate connections by claims
     */
    function(places, callback) {


      // return callback(null, places)
      

      // var destinations = places
      $scope.status = 'Analysing connections'
      // $scope.$apply()
      var claims = Data.get().claims

      var connections = []
      var analysed = []
      // var claims = {}

      var chosen_claims = [
        'P1435', // heritage status
        'P149',  // architectural style
        'P31',   // instance of
        // 'P131',  // located in the administrative territorial entity
        'P84',   // architect
        'P1619', // date of official opening
        // 'P571'   // inception
      ]

      async.eachOfSeries(claims, function(claim, claim_id, callback_claims_series) {
        // Skip if not a chosen claim
        if( ! _.includes(chosen_claims, claim_id)) return callback_claims_series()
        // $scope.status = 'Analysing ' + place.name
        // $scope.$apply()

        // console.log(claim_id)

        // Go through each of the claims and compare
        async.eachOfSeries(claim, function(source, source_id, callback_places_series) {
          source = source[0]
          async.eachOfSeries(claim, function(target, target_id, callback_destinations_series) {
            target = target[0]
            // console.log(target)
            // Skip if place = destination
            if(source_id == target_id) return callback_destinations_series()
            
            // Skip if this destination has already been analysed
            if(_.includes(analysed, target_id)) return callback_destinations_series()

            // console.log(source.mainsnak.datatype)

            if(source.mainsnak.datatype != 'wikibase-item') {
              console.log(claim_id + ' is of type: ' + source.mainsnak.datatype + ' not wikibase')
            }

            // If both place and destination have the same value for claim
            if(source.mainsnak.datavalue.value.id == target.mainsnak.datavalue.value.id) {
              var c = {
                data: {
                  id: claim_id + '-' + source_id + '-' + target_id,
                  source: source_id,
                  target: target_id,
                  claim_id: claim_id,
                  claim: source
                }
              }
              connections.push(c)
            }

            callback_destinations_series()
          }, function(err) {
            if(err) console.error(err)
            analysed.push(source_id)
            callback_places_series()
          }) // end of destination series
        }, function(err) {
          if(err) console.error(err)
          // analysed.push(place['@id'])
          callback_claims_series()
        }) // end of places series

      }, function(err) {
        if(err) console.error(err)
        // metadata.claims = claims
        // Data.set(metadata)
        Connection.set(connections)
        callback(null, places)
      }) // end of claims series


      // callback(null, places)
    },

  ],
  /**
   * Async waterfall complete
   */
  function(err, places) {
      if(err) {
        console.error(err)
      }

      $scope.status = 'Computation complete'
      $location.path('/schedule')
      // $scope.$apply()
      // window.location.href = '/#/schedule'
  })

})
