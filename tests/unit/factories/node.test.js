'use strict'

describe('app.nodeFactory module', function() {

  beforeEach(module('app'))

  describe('Node factory', function() {
    var factory

    beforeEach(inject(function($injector) {
      factory = $injector.get('Node')
    }))

    it('should be defined', inject(function() {
      expect(factory).toBeDefined()
    }))

    describe('get method', function() {
      it('should be defined', inject(function() {
        expect(factory.get).toBeDefined()
      }))

      it('should return false', inject(function() {
        expect(factory.get()).toBeFalsy()
      }))
    })

    describe('set method', function() {
      it('should be defined', inject(function() {
        expect(factory.set).toBeDefined()
      }))
    })

    describe('isset method', function() {
      it('should be defined', inject(function() {
        expect(factory.isset).toBeDefined()
      }))

      it('should return false', inject(function() {
        expect(factory.isset()).toBeFalsy()
      }))
    })

    describe('unset method', function() {
      it('should be defined', inject(function() {
        expect(factory.unset).toBeDefined()
      }))
    })

  })
})