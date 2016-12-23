'use strict'

describe('app.map module', function() {

  beforeEach(module('app'))

  describe('MapCtrl controller', function() {
  var scope, ctrl

    beforeEach(inject(function($rootScope, $controller, $injector) {
      scope = $rootScope.$new()
      ctrl = $controller('MapCtrl', { $scope: scope })
    }))

    it('should be defined', inject(function($controller) {
      expect(ctrl).toBeDefined()
    }))

  })
})