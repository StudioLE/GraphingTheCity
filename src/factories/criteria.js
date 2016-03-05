'use strict'

angular.module('app.criteriaFactory', [])

/*****************************************************************
*
* Criteria factory
*
******************************************************************/
.factory('Criteria', function(localStorageService) {
  return {

    /**
     * Data getter
     *
     * @return {Array} data
     */
    get: function() {
      return localStorageService.get('criteria')
    },

    /**
     * Data setter
     *
     * @return {Array} data
     */
    set: function(data) {
      return localStorageService.set('criteria', data)
    },

    /**
     * Data is set
     *
     * @return {Bool} data
     */
    isset: function() {
      if(localStorageService.get('criteria')) {
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
      return localStorageService.remove('criteria')
    }
  }
})
