'use strict'

angular.module('app.compute', ['ngRoute'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/compute', {
    templateUrl: 'views/process.html',
    controller: 'ComputeCtrl'
  })
}])

/*****************************************************************
*
* ComputeCtrl controller
*
******************************************************************/
.controller('ComputeCtrl', function($scope, $http, $location, Config, Criteria, Entity, Claim, Node, Connection, Data, Helper) {

  /**
   * Get data from local storage
   */
  var criteria = Criteria.get()

  /**
   * Redirect if no criteria
   */
  if( ! criteria) return $location.path('/criteria')

  $scope.criteria = function() {
    return criteria
  }

  $scope.step = 1

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

  var metadata = {}

  async.waterfall([

    /**
     * Get list of Places from Google Knowledge Search API
     */
    function(callback) {

      $scope.status = 'Get list of Places from Google Knowledge Search API'
      $scope.step = 2

      // Types from types hierarchy: http://schema.org/docs/full.html

      $http({
        method: 'GET',
        url: 'https://kgsearch.googleapis.com/v1/entities:search?indent=true&prefix=true&types=LandmarksOrHistoricalBuildings&types=TouristAttraction&types=CivicStructure&types=BodyOfWater&limit=200&key=' + Config.place_api_key + '&query=' + criteria.city.name
      }).then(function successCallback(response) {
        console.log('Knowledge Graph returned %s results', response.data.itemListElement.length)
        callback(null, response.data.itemListElement)
      }, function errorCallback(response) {
        callback(response)
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
        no_match: 0,
        nodes: 0,
        connections: 0,
        places: 0,
        claims: 0
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
          concatCallback(response)
        })

      }, function(err, results) {
        if(err) return callback(err, results)
        callback(null, knowledgeGraph, results)
      })
    },

    /**
     * Store Places data
     */
    function(knowledgeGraph, wikidata, callback) {

      var places = _.keyBy(wikidata, 'id')
      // Store all places to local storage
      Entity.set(places)

      callback(null, places)
    },

    /**
     * Filter out non-local objects
     */
    function(places, callback) {

      $scope.status = 'Filter Places'
      $scope.step = 4

      var centrePoint = Helper.formatGooglePlaceToSchema(criteria.city.geometry.location)

      // Filter out places that do not work
      places = _.filter(places, function(place) {
        if( ! place.claims || ! place.claims.P625) {
          // console.log('No .geo for:', place.name, place)
          metadata.count.no_geo ++
          return false
        }

        place.geo = {
          '@type': 'GeoCoordinates',
          latitude: place.claims.P625[0].mainsnak.datavalue.value.latitude,
          longitude: place.claims.P625[0].mainsnak.datavalue.value.longitude
        }

        var bounds = criteria.city.geometry.viewport

        if(
          place.geo.latitude <= bounds.north &&
          place.geo.latitude >= bounds.south &&
          place.geo.longitude <= bounds.east &&
          place.geo.longitude >= bounds.west
        ) {
          return true
        }
        else {
          metadata.count.out_of_bounds ++
          return false
        }
      })

      callback(null, places)

    },

    /**
     * Store places as Nodes
     */
    function(places, callback) {

      $scope.status = 'Storing places'

      metadata.count.places = places.length

      var nodes = _.map(places, function(place) {
        return {
          data: {
            id: place.id,
            name: place.labels.en.value,
            type: 'place',
            geo: place.geo
          },
          classes: 'place'
          // selected: true,
          // selectable: true,
          // locked: true,
          // grabbable: true
        }
      })

      Node.set(nodes)
      callback(null, places)
    },

    /**
     * Record all Claims
     */
    function(places, callback) {
      $scope.status = 'Record all Claims'
      $scope.step = 5

      var destinations = places
      var connections = []
      var analysed = []
      var claims = {}

      async.eachSeries(places, function(place, callback_places_series) {

        $scope.status = 'Analysing ' + place.name

        // Add each of this place's claims to the claims object
        _.each(place.claims, function(claim, claim_id) {
          // If this is the first of claim type then add to object
          if( ! claims[claim_id]) claims[claim_id] = {}
          // For this claim, add each of its values to the relevant claim object
          _.each(claim, function(claim_val) {

            // Skip if snaktype isn't value. Otherwise app will break.
            if(claim_val.mainsnak.snaktype != 'value') return false

            // Ensure the property exists
            if( ! claims[claim_id][claim_val.mainsnak.datavalue.value.id]) claims[claim_id][claim_val.mainsnak.datavalue.value.id] = {}

            claims[claim_id][claim_val.mainsnak.datavalue.value.id][place.id] = claim_val
          })

        })

        // Connect by distance deprecated so skip
        return callback_places_series()

      }, function(err) {
        if(err) console.error(err)

        callback(null, places, claims)
      }) // end of places series
    },

    /**
     * Analyse Claims
     */
    function(places, claims, callback) {

      $scope.status = 'Analyse Claims'

      var connections = []
      var analysed = []
      var claim_nodes = []
      metadata.entities = []

      // Convert properties from ng-tags-input format to a simple array
      var chosen_claims = _.map(criteria.properties, function(prop) {
        return prop.text
      })

      async.eachOfSeries(claims, function(claim_prop, claim_prop_id, callback_claim_properties_series) {

        // Example: claim_prop_id = P149
        // Skip if not a chosen claim
        if( ! _.isEmpty(chosen_claims) && ! _.includes(chosen_claims, claim_prop_id)) return callback_claim_properties_series()

        // Go through each of the claims and compare
        async.eachOfSeries(claim_prop, function(claim_val, claim_val_id, callback_claim_val_series) {
          // Example: claim_val_id = Q176483 (Gothic Architecture)

          // Ignore if undefined
          if( ! claim_val_id || claim_val_id == 'undefined') return callback_claim_val_series()

          // Ignore if there are fewer than 2 answers
          if(Object.keys(claim_val).length < 2) return callback_claim_val_series()

          // If all claims then store the claim_prop_id so we can fetch it later
          if(_.isEmpty(chosen_claims) && ! _.includes(metadata.entities, claim_prop_id)) metadata.entities.push(claim_prop_id)

          // Store the claim_val_id so we can fetch it later
          metadata.entities.push(claim_val_id)

          // It may be that a claim node can be used for more than one property
          // So, check whether the claim node already exists
          // If it does, add the claim_prop_id
          var claim_index = _.findIndex(claim_nodes, {
            data: {
              id: claim_val_id
            }
          })
          // claim_index will be -1 if not found
          if(claim_index >= 0) {
            claim_nodes[claim_index].data.property.push(claim_prop_id)
          }
          // Else store it as usual
          else {
            claim_nodes.push({
              data: {
                id: claim_val_id,
                name: claim_val_id,
                property: [claim_prop_id],
                type: 'claim'
              },
              classes: 'claim'
            })
          }

          // Connect each node to the claim_val
          _.each(claim_val, function(place, place_id) {
              var c = {
                data: {
                  id: claim_prop_id + '-' + place_id + '-' + claim_val_id,
                  source: place_id,
                  target: claim_val_id,
                  claim_property: claim_prop_id,
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

        // Store all claim nodes in local storage
        Node.add(claim_nodes)

        // Store all connections in local storage
        Connection.set(connections)

        callback(null, places)
      }) // end of claims series
    },

    /**
     * Get data for Claim Values & Claim Properties
     */
    function(places, callback) {

      $scope.status = 'Get data for Claims from Wikidata API'
      $scope.step = 6

      var nodes = Node.get()

      // Combine claim values and properties
      metadata.entities = metadata.entities.concat(_.map(criteria.properties, function(prop) {
        return prop.text
      }))

      // Wikidata API will only return 50 results so we divide the titles into chunks for separate queries
      async.concat(_.chunk(metadata.entities, 50), function(claim_ids, concatCallback) {

        // Create a string from the ids
        claim_ids = claim_ids.join('|')

        $http({
          method: 'GET',
          // url: 'https://en.wikipedia.org/w/api.php?action=query&prop=coordinates&format=json&origin=*&titles=' + titles
          // url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&format=json&languages=en&origin=*&titles=' + titles
          url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&format=json&languages=en&origin=*&ids=' + claim_ids
        }).then(function successCallback(response) {
          console.log('Wikidata returned %s claims', _.keys(response.data.entities).length)
          // async.concat only works with arrays so convert data to array
          concatCallback(null, _.values(response.data.entities))
        }, function errorCallback(response) {
          concatCallback(response)
        })

      }, function(err, results) {
        if(err) return callback(err, results)

        // Store Claim Values in local storage
        Entity.add(_.keyBy(results, 'id'))

        callback(null, places)
      })

    },

    /**
     * Final counts
     */
    function(places, callback) {

      $scope.status = 'Storing places'

      var nodes = Node.get()
      var connections = Connection.get()

      metadata.count.nodes = nodes.length
      metadata.count.connections = connections.length
      var place_nodes = _.filter(nodes, function(node) {
        return node.data.type == 'place'
      })
      metadata.count.claims = _.filter(nodes, function(node) {
        return node.data.type == 'claim'
      }).length

      var chosen_claims = _.map(criteria.properties, function(prop) {
        return prop.text
      })

      if( ! _.isEmpty(chosen_claims)) {
        var entities = Entity.get()

        var count = {}

        _.each(chosen_claims, function(prop_id) {
          count[prop_id] = 0
        })

        _.each(place_nodes, function(place) {
          _.each(chosen_claims, function(prop_id) {
            if(entities[place.data.id].claims[prop_id]) {
              count[prop_id] ++
            }
          })
        })

        metadata.count.properties = count
      }

      metadata.count.places = place_nodes.length

      // Store Metadata in local storage
      Data.set(metadata)

      callback(null, places)
    },

  ],

  /**
   * Async waterfall complete
   */
  function(err, places) {
    if(err) {
      Data.add({
        error: err
      })
      $location.path('/error')
      return console.error(err)
    }

    $scope.status = 'Computation complete'
    // $scope.step = 10
    $location.path('/graph')
  })

})
