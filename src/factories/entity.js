'use strict'

angular.module('app.entityFactory', [])

/*****************************************************************
*
* Entity factory
*
******************************************************************/
.factory('Entity', function(localStorageService) {
  return {

    /**
     * Data getter
     *
     * @return {Array} data
     */
    get: function() {
      return localStorageService.get('entity')
    },

    /**
     * Data setter
     *
     * @return {Array} data
     */
    set: function(data) {
      return localStorageService.set('entity', data)
    },

    /**
     * Data setter
     *
     * @return {Array} data
     */
    add: function(data) {
      return localStorageService.set('entity',
        _.assign({}, data, this.get())
      )
    },

    /**
     * Data is set
     *
     * @return {Bool} data
     */
    isset: function() {
      if(localStorageService.get('entity')) {
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
      return localStorageService.remove('entity')
    }
  }
})
