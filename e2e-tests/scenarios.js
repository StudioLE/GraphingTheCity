'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Graphing the City', function() {

  it('should automatically redirect to /criteria when location hash/fragment is empty', function() {
    browser.get('');
    // browser.pause();
    expect(browser.getLocationAbsUrl()).toMatch("/criteria");
  });

  describe('criteria', function() {

    beforeEach(function() {
      browser.get('#/criteria');
    });

    it('should render h1 when user navigates to /criteria', function() {
      expect(element(by.css('h1')).getText()).toMatch(/Graphing the City/i);
    });

    it('should select London, UK when user enters \'lond\' to input', function() {
      element(by.model('criteria().city')).sendKeys('lond')
        .sendKeys(protractor.Key.ARROW_DOWN)
        .sendKeys(protractor.Key.ENTER)
      element(by.model('criteria().city')).getAttribute('value').then(function (value) {
          expect(value).toMatch('London, UK');
        });
    });

    it('should go to /graph when user submits input', function() {
      // element(by.css('form button')).click()
      element(by.model('criteria().city')).sendKeys('lond')
        .sendKeys(protractor.Key.ARROW_DOWN)
        .sendKeys(protractor.Key.ENTER)
        .sendKeys(protractor.Key.ENTER)
      expect(browser.getLocationAbsUrl()).toMatch("/graph");
      // browser.pause();
    });

  });

  describe('graph', function() {

    beforeEach(function() {
      browser.get('#/graph');
    });

    it('should have more than 200 nodes', function() {
      expect(element(by.binding('data().count.nodes')).getText())
        .toBeGreaterThan(200);
    });

    it('should have more than 200 connections', function() {
      expect(element(by.binding('data().count.connections')).getText())
        .toBeGreaterThan(200);
    });

    it('should have more than 160 places', function() {
      expect(element(by.binding('data().count.places')).getText())
        .toBeGreaterThan(160);
    });

    it('should have more than 50 claims', function() {
      expect(element(by.binding('data().count.claims')).getText())
        .toBeGreaterThan(50);
    });

  });

  it('should now automatically redirect to /graph when location hash/fragment is empty', function() {
    browser.get('');
    expect(browser.getLocationAbsUrl()).toMatch("/graph");
  });

});