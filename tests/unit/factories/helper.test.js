'use strict'

describe('app.helperFactory module', function() {

  beforeEach(module('app'))

  describe('Helper factory', function() {
    var factory

    beforeEach(inject(function($injector) {
      factory = $injector.get('Helper')
    }))

    it('should be defined', inject(function() {
      expect(factory).toBeDefined()
    }))

  })
})