'use strict'

describe('app.infoboxFactory module', function() {

  beforeEach(module('app'))

  describe('Infobox factory', function() {
    var factory

    beforeEach(inject(function($injector) {
      factory = $injector.get('Infobox')
    }))

    it('should be defined', inject(function() {
      expect(factory).toBeDefined()
    }))

    describe('get method', function() {
      it('should be defined', inject(function() {
        expect(factory.get).toBeDefined()
      }))

      it('should return state \'default\'', inject(function() {
        expect(factory.get().state).toEqual('default')
      }))
    })

    describe('set method', function() {
      it('should be defined', inject(function() {
        expect(factory.set).toBeDefined()
      }))
    })

    describe('unset method', function() {
      it('should be defined', inject(function() {
        expect(factory.unset).toBeDefined()
      }))
    })

  })
})