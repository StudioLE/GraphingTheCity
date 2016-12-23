'use strict'

describe('app.analysis module', function() {

  beforeEach(module('app'))

  describe('AnalysisCtrl controller', function() {
    var scope, ctrl

    beforeEach(inject(function($rootScope, $controller, $injector) {
      scope = $rootScope.$new()
      ctrl = $controller('AnalysisCtrl', { $scope: scope })
    }))

    it('should be defined', inject(function($controller) {
      expect(ctrl).toBeDefined()
    }))

  })
})