'use strict'

describe('app.graph module', function() {

  beforeEach(module('app'))

  describe('GraphCtrl controller', function() {
    var scope, ctrl

    beforeEach(inject(function($rootScope, $controller, $injector) {
      scope = $rootScope.$new()
      ctrl = $controller('GraphCtrl', { $scope: scope })
    }))

    it('should be defined', inject(function($controller) {
      expect(ctrl).toBeDefined()
    }))

  })
})