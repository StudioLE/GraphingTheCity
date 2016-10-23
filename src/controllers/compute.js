'use strict'

angular.module('app.compute', ['ngRoute'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/compute', {
    templateUrl: 'views/criteria.html',
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

  $scope.criteria = function() {
    return criteria
  }

  $scope.step = 1;

  /**
   * Check Stage
   *
   * Show progress
   */
  $scope.checkProgress = function(num) {
    if(num == $scope.step ) {
      return 'active'
    }
    else if (num < $scope.step) {
      return 'complete'
    }
    else {
      return ''
    }
  }
  
  var places = []
  var metadata = {}

  async.waterfall([

    /**
     * Get list of Places from Google Knowledge Search API
     */
    function(callback) {

      $scope.status = 'Get list of Places from Google Knowledge Search API'
      $scope.step = 2

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
     * Get data for Places from Wikidata API
     */
    function(knowledgeGraph, callback) {

      $scope.status = 'Get data for Places from Wikidata API'
      $scope.step = 3

      // Create an array of all place names from Knowledge Graph data
      var titles = _.map(knowledgeGraph, function(element) {
        return element.result.name
      })

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
     * Associate Places with Data
     */
    function(knowledgeGraph, wikidata, callback) {

      $scope.status = 'Associate Places with Data'
      $scope.step = 4

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

      $scope.status = 'Filter Places'
      $scope.step = 5

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

      $scope.status = 'Storing places'

      metadata.count.places = places.length

      Place.set(_.values(places))
      callback(null, places)
    },

    /**
     * Record all Claims
     */
    function(places, callback) {
      $scope.status = 'Record all Claims'
      $scope.step = 6

      var destinations = places
      var connections = []
      var analysed = []
      var claims = {}

      async.eachSeries(places, function(place, callback_places_series) {

        $scope.status = 'Analysing ' + place.name

        // Add each of this place's claims to the claims object
        _.each(place.wikidata.claims, function(claim, claim_id) {
          // If this is the first of claim type then add to object
          if( ! claims[claim_id]) claims[claim_id] = {}
          // For this claim, add each of its values to the relevant claim object
          _.each(claim, function(claim_val) {
            // console.log(claim_val)
            // Skip if no value
            if(claim_val.mainsnak.snaktype == "novalue" ) return false

            // Ensure the property exists
            if( ! claims[claim_id][claim_val.mainsnak.datavalue.value.id]) claims[claim_id][claim_val.mainsnak.datavalue.value.id] = {}

            claims[claim_id][claim_val.mainsnak.datavalue.value.id][place.id] = claim_val
          })

        })

        // Connect by distance deprecated so skip
        return callback_places_series()

      }, function(err) {
        if(err) console.error(err)
        metadata.claims = claims
        callback(null, places)
      }) // end of places series
    },

    /**
     * Get data for Claim Properties
     */
    function(places, callback) {

      $scope.status = 'Get data for Claim Properties from Wikidata API'
      $scope.step = 7

      var claim_ids = _.keys(metadata.claims)

      // Wikidata API will only return 50 results so we divide the titles into chunks for separate queries
      async.concat(_.chunk(claim_ids, 50), function(claim_ids, concatCallback) {

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
        callback(null, places)
      })

    },

    /**
     * Analyse Connections
     */
    function(places, callback) {

      $scope.status = 'Analyse Connections'
      $scope.step = 8

      var claims = metadata.claims

      var connections = []
      var analysed = []
      var claim_nodes = []
      // var metadata = Data.get()
      // var claims = {}

      var chosen_claims = [
        // 'P1435', // heritage status
        'P149',  // architectural style
        'P31',   // instance of
        // 'P131',  // located in the administrative territorial entity
        'P84',   // architect
        // 'P1619', // date of official opening
        // 'P571'   // inception
        'P177' // Crosses
      ]

      async.eachOfSeries(claims, function(claim_prop, claim_prop_id, callback_claim_properties_series) {
        // Example: claim_prop_id = P149
        // Skip if not a chosen claim
        if( ! _.includes(chosen_claims, claim_prop_id)) return callback_claim_properties_series()

        // Go through each of the claims and compare
        async.eachOfSeries(claim_prop, function(claim_val, claim_val_id, callback_claim_val_series) {
          // Example: claim_val_id = Q176483 (Gothic Architecture)

          // $scope.status = 'Analysing connection: ' + claim_prop_id + ' for ' + claim_val_id

          // @todo Add to list to find out wtf this value is?

          // console.log(claim_val)

          // Ignore if there are less than 2 answers
          if(Object.keys(claim_val).length < 2) return callback_claim_val_series()

          claim_nodes.push({
            id: claim_val_id,
            name: claim_val_id // @todo request claim label from Wikidata
          })

          // Connect each node to the claim_val
          _.each(claim_val, function(place, place_id) {
              var c = {
                data: {
                  id: claim_prop_id + '-' + place_id + '-' + claim_val_id,
                  source: place_id,
                  target: claim_val_id,
                  claim_id: claim_prop_id,
                  // claim: claim_val
                }
              }
              connections.push(c)
          })

          return callback_claim_val_series()
        }, function(err) {
          if(err) console.error(err)
          // analysed.push(place['@id'])
          callback_claim_properties_series()
        }) // end of claim_val_series series

      }, function(err) {
        if(err) console.error(err)
        metadata.claim_nodes = claim_nodes
        // Data.set(metadata)
        Connection.set(connections)
        callback(null, places)
      }) // end of claims series
    },

    /**
     * Get data for Claim Values
     */
    function(places, callback) {

      $scope.status = 'Get data for Claim Values from Wikidata API'
      $scope.step = 9

      var claim_ids = _.map(metadata.claim_nodes, function(c) {
        return c.id
      })

      // Wikidata API will only return 50 results so we divide the titles into chunks for separate queries
      async.concat(_.chunk(claim_ids, 50), function(claim_ids, concatCallback) {

        // Create a string from the ids
        claim_ids = claim_ids.join('|')

        $http({
          method: 'GET',
          // url: 'https://en.wikipedia.org/w/api.php?action=query&prop=coordinates&format=json&origin=*&titles=' + titles
          // url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&format=json&languages=en&origin=*&titles=' + titles
          url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&format=json&languages=en&origin=*&ids=' + claim_ids
        }).then(function successCallback(response) {
          console.log('Wikidata returned %s claim values', _.keys(response.data.entities).length)
          // async.concat only works with arrays so convert data to array
          concatCallback(null, _.values(response.data.entities))
        }, function errorCallback(response) {
          concatCallback(true, response)
        })

      }, function(err, results) {
        if(err) return callback(err, results)

        // Convert wikidata array to object
        metadata.values = _.keyBy(results, 'id')
        // metadata.values = results

        Data.set(metadata)
        callback(null, places)
        // callback(null, knowledgeGraph, results)
      })

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
    $scope.step = 10
    $location.path('/graph')
  })

})
