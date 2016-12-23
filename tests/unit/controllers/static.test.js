'use strict'

describe('app.static module', function() {

  beforeEach(module('app'))

  describe('ErrorCtrl controller', function() {
    var scope, ctrl

    beforeEach(inject(function($rootScope, $controller, $injector) {
      scope = $rootScope.$new()
      ctrl = $controller('ErrorCtrl', { $scope: scope })
    }))

    it('should be defined', inject(function($controller) {
      expect(ctrl).toBeDefined()
    }))

  })

  describe('HomeCtrl controller', function() {
    var scope, ctrl

    beforeEach(inject(function($rootScope, $controller, $injector) {
      scope = $rootScope.$new()
      ctrl = $controller('HomeCtrl', { $scope: scope })
    }))

    it('should be defined', inject(function($controller) {
      expect(ctrl).toBeDefined()
    }))

  })
})