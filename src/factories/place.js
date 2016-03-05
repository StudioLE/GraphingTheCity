'use strict'

angular.module('app.placeFactory', [])

/*****************************************************************
*
* Place factory
*
******************************************************************/
.factory('Place', function(localStorageService) {
  return {

    /**
     * Data getter
     *
     * @return {Array} data
     */
    get: function() {
      return localStorageService.get('place')
    },

    /**
     * Data setter
     *
     * @return {Array} data
     */
    set: function(data) {
      return localStorageService.set('place', data)
    },

    /**
     * Data is set
     *
     * @return {Bool} data
     */
    isset: function() {
      if(localStorageService.get('place')) {
        return true
      }
      else {
        return false
      }
    },

    /**
     * Data unset
     */
    unset: function() {
      return localStorageService.remove('place')
    }
  }
})
