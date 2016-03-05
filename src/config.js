'use strict'

angular.module('app.config', [])

/*****************************************************************
*
* Configuration
*
******************************************************************/
.constant('Config', {
  app_url: 'http://localhost:1337',
  place_api_endpoint: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
  place_api_key: 'AIzaSyClYM73nng_qK5MdY2mvVYcafxNESu4RIQ',
  graph: {
    width: 500,
    height: 500,
    grid: {
      colour: '#ddd'
    }
  },
  endpoint: function(req) {
    return this.endpoint_url + req + '/json' 
    // ?key=AIzaSyClYM73nng_qK5MdY2mvVYcafxNESu4RIQ&location=55,-1.6&radius=10000&type=train_station&rankby=prominence
  }
})
