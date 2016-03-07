'use strict'

angular.module('app.criteria', ['ngRoute'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/criteria', {
    templateUrl: 'views/criteria.html',
    controller: 'CriteriaCtrl'
  })
}])

/*****************************************************************
*
* CriteriaCtrl controlller
*
******************************************************************/
.controller('CriteriaCtrl', function($scope, $location, Criteria) {

  /**
   * Get data from local storage
   */
  if( ! Criteria.isset()) Criteria.set({})
  var criteria = Criteria.get()
  // var places = Place.get()

  $scope.criteria = function() {
    return criteria
  }

  $scope.autocompleteOptions = {
    // componentRestrictions: { country: 'au' },
    types: ['(cities)']
  }
  

  /**
   * Update data model
   *
   * Called when form is saved
   */
  $scope.saveCriteria = function() {
    console.log($scope.criteria())
    criteria = $scope.criteria()
    Criteria.set(criteria)
    // console.log(data)

    $location.path('/compute')

  }

  /**
   * Remove row
   *
   * Called when a x-editable is saved
   */
  $scope.removeRow = function(row) {
    // Toggle remove
    // row.removed = ! row.removed
    // Data.set($scope.data())
  }

  $scope.types = [
    // 'accounting',
    'airport',
    // 'amusement_park',
    'aquarium',
    'art_gallery',
    // 'atm',
    // 'bakery',
    'bank',
    // 'bar',
    // 'beauty_salon',
    // 'bicycle_store',
    // 'book_store',
    // 'bowling_alley',
    'bus_station',
    // 'cafe',
    // 'campground',
    // 'car_dealer',
    // 'car_rental',
    // 'car_repair',
    // 'car_wash',
    // 'casino',
    // 'cemetery',
    // 'church',
    'city_hall',
    // 'clothing_store',
    // 'convenience_store',
    'courthouse',
    'dentist',
    // 'department_store',
    // 'doctor',
    // 'electrician',
    // 'electronics_store',
    // 'embassy',
    // 'establishment (deprecated)',
    // 'finance (deprecated)',
    // 'fire_station',
    // 'florist',
    // 'food (deprecated)',
    // 'funeral_home',
    // 'furniture_store',
    // 'gas_station',
    // 'general_contractor (deprecated)',
    // 'grocery_or_supermarket',
    // 'gym',
    // 'hair_care',
    // 'hardware_store',
    // 'health (deprecated)',
    // 'hindu_temple',
    // 'home_goods_store',
    'hospital',
    // 'insurance_agency',
    // 'jewelry_store',
    // 'laundry',
    // 'lawyer',
    'library',
    // 'liquor_store',
    // 'local_government_office',
    // 'locksmith',
    // 'lodging',
    // 'meal_delivery',
    // 'meal_takeaway',
    // 'mosque',
    // 'movie_rental',
    // 'movie_theater',
    // 'moving_company',
    'museum',
    // 'night_club',
    // 'painter',
    // 'park',
    // 'parking',
    // 'pet_store',
    // 'pharmacy',
    // 'physiotherapist',
    // 'place_of_worship (deprecated)',
    // 'plumber',
    'police',
    'post_office',
    // 'real_estate_agency',
    // 'restaurant',
    // 'roofing_contractor',
    // 'rv_park',
    'school',
    // 'shoe_store',
    'shopping_mall',
    // 'spa',
    'stadium',
    // 'storage',
    // 'store',
    // 'subway_station',
    // 'synagogue',
    // 'taxi_stand',
    'train_station',
    // 'travel_agency',
    'university',
    // 'veterinary_care',
    // 'zoo'
  ]

})
