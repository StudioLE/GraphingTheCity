'use strict'

angular.module('app.nodeFactory', [])

/*****************************************************************
*
* Node factory
*
******************************************************************/
.factory('Node', function(localStorageService) {
  return {

    /**
     * Data getter
     *
     * @return {Array} data
     */
    get: function() {
      return localStorageService.get('node')
    },

    /**
     * Data setter
     *
     * @return {Array} data
     */
    set: function(data) {
      return localStorageService.set('node', data)
    },

    /**
     * Data setter
     *
     * @return {Array} data
     */
    add: function(data) {
      return localStorageService.set('node', data.concat(this.get()))
    },

    /**
     * Data is set
     *
     * @return {Bool} data
     */
    isset: function() {
      if(localStorageService.get('node')) {
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
      return localStorageService.remove('node')
    }
  }
})
