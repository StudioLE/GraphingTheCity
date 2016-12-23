'use strict'

describe('app.compute module', function() {

  beforeEach(module('app'))

  describe('ComputeCtrl controller', function() {
    var scope, ctrl

    beforeEach(inject(function($rootScope, $controller, $injector) {
      scope = $rootScope.$new()
      ctrl = $controller('ComputeCtrl', { $scope: scope })
    }))

    it('should be defined', inject(function($controller) {
      expect(ctrl).toBeDefined()
    }))

  })
})