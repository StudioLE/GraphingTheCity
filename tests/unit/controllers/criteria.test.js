'use strict'

describe('app.criteria module', function() {

  beforeEach(module('app'))

  describe('CriteriaCtrl controller', function() {
    var scope, ctrl

    beforeEach(inject(function($rootScope, $controller, $injector) {
      scope = $rootScope.$new()
      ctrl = $controller('CriteriaCtrl', { $scope: scope })
    }))

    it('should be defined', inject(function($controller) {
      expect(ctrl).toBeDefined()
    }))

  })
})