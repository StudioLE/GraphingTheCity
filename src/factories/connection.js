'use strict'

angular.module('app.connectionFactory', [])

/*****************************************************************
*
* Connection factory
*
******************************************************************/
.factory('Connection', function(localStorageService) {
  return {

    /**
     * Data getter
     *
     * @return {Array} data
     */
    get: function() {
      return localStorageService.get('connection')
    },

    /**
     * Data setter
     *
     * @return {Array} data
     */
    set: function(data) {
      return localStorageService.set('connection', data)
    },

    /**
     * Data add
     *
     * @return {Array} events
     */
    add: function(data) {
      var data = []
      if(this.isset()) {
        data = data.concat(this.get())
      }
      data.push(data)
      return localStorageService.set('connection', data)
    },

    /**
     * Data is set
     *
     * @return {Bool} data
     */
    isset: function() {
      if(localStorageService.get('connection')) {
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
      return localStorageService.remove('connection')
    }
  }
})
