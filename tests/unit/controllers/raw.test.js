'use strict'

describe('app.raw module', function() {

  beforeEach(module('app'))

  describe('RawCtrl controller', function() {
  var scope, ctrl

    beforeEach(inject(function($rootScope, $controller, $injector) {
      scope = $rootScope.$new()
      ctrl = $controller('RawCtrl', { $scope: scope })
    }))

    it('should be defined', inject(function($controller) {
      expect(ctrl).toBeDefined()
    }))

  })
})