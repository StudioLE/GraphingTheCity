'use strict'

angular.module('app.infoboxFactory', [])

/*****************************************************************
*
* Infobox factory
*
******************************************************************/
.factory('Infobox', function() {
var data 
return {

  data: {
    state: 'default',
    content: {}
  },

  /**
   * Get infobox content
   */
  get: function() {
    return data
  },

  /**
   * Set infobox content
   */
  set: function(state, content, clicked) {
    data = {
      state: state,
      content: content,
      clicked: clicked
    }
  },

  unset: function() {
    data = {
      state: 'default',
      clicked: false,
      content: {},
    }
  }

}
})
