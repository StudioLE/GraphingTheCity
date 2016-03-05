'use strict'

angular.module('app.dataFactory', [])

/*****************************************************************
*
* Data factory
*
******************************************************************/
.factory('Data', function(localStorageService, Config) {
  return {

    /**
     * Data getter
     *
     * @return {Array} data
     */
    get: function() {
      return localStorageService.get('data')
    },

    /**
     * Data setter
     *
     * @return {Array} data
     */
    set: function(data) {
      return localStorageService.set('data', data)
    },

    /**
     * Data is set
     *
     * @return {Bool} data
     */
    isset: function() {
      if(localStorageService.get('data')) {
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
      return localStorageService.remove('data')
    }
  }
})
