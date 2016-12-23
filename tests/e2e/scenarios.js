'use strict'

var EC = protractor.ExpectedConditions

describe('Graphing the City', function() {

  it('should automatically redirect to /criteria when location hash/fragment is empty', function() {
    browser.get('')
    expect(browser.getLocationAbsUrl()).toMatch("/criteria")
  })

  describe('graph', function() {

    it('should automatically redirect to /criteria when criteria not set', function() {
      browser.get('#/graph')
      expect(browser.getLocationAbsUrl()).toMatch("/criteria")
    })

  })

  describe('criteria', function() {

    beforeAll(function() {
      browser.get('#/criteria')
    })

    it('should render h1 when user navigates to /criteria', function() {
      expect(element(by.css('h1')).getText()).toMatch(/Graphing the City/i)
    })

    it('should go to /graph when user submits input', function() {
      var input = element(by.model('criteria().city'))
      input.sendKeys('lond')
      browser.wait(EC.presenceOf($('.pac-container'))(input, 'London, UK'), 2000, 'timed out waiting for input to autocomplete')
        .then(function() {
        input.sendKeys(protractor.Key.ARROW_DOWN)
          .sendKeys(protractor.Key.ENTER).then(function() {
            input.getAttribute('value').then(function(val) {
              console.log('\n' + val + '\n')
            })
            input.sendKeys(protractor.Key.ENTER)
            expect(browser.getLocationAbsUrl()).toMatch("/graph")
          })
        })
    })

  })

  describe('graph', function() {

    beforeAll(function() {
      browser.get('#/graph')
      browser.wait(EC.stalenessOf($('#loading')), 30000, 'timed out waiting for SNA to complete')
    })

    it('should have more than 200 nodes', function() {
      expect(element(by.binding('data().count.nodes')).getText())
        .toBeGreaterThan(200)
    })

    it('should have more than 200 connections', function() {
      expect(element(by.binding('data().count.connections')).getText())
        .toBeGreaterThan(200)
    })

    it('should have more than 160 places', function() {
      expect(element(by.binding('data().count.places')).getText())
        .toBeGreaterThan(160)
    })

    it('should have more than 50 claims', function() {
      expect(element(by.binding('data().count.claims')).getText())
        .toBeGreaterThan(50)
    })

  })

  describe('analysis', function() {

    beforeAll(function() {
      browser.get('#/analysis')
    })

    it('should render h1 when user navigates to /criteria', function() {
      expect(element(by.css('h1')).getText()).toMatch('Social Network Analysis')
    })

    describe('claims table', function() {

      it('should have more than 50 rows', function() {
        expect(element.all(by.css('table#claims tr')).count())
          .toBeGreaterThan(50)
      })

      it('should have id set', function() {
        expect(element(by.css('table#claims tr:first-child td:nth-child(2) a')).getText())
          .toBeTruthy()
      })

      it('should have property set', function() {
        expect(element(by.css('table#claims tr:first-child td:nth-child(3) a')).getText())
          .toBeTruthy()
      })

      it('should have label set', function() {
        expect(element(by.css('table#claims tr:first-child td:nth-child(4) a')).getText())
          .toBeTruthy()
      })

      it('should have degree centrality set', function() {
        expect(element(by.css('table#claims tr:first-child td:nth-child(5)')).getText())
          .toBeGreaterThan(0)
      })

      it('should have closeness centrality set', function() {
        expect(element(by.css('table#claims tr:first-child td:nth-child(6)')).getText())
          .toBeGreaterThan(0)
      })

      it('should have betweenness centrality set', function() {
        expect(element(by.css('table#claims tr:first-child td:nth-child(7)')).getText())
          .toBeGreaterThan(0)
      })

    })

  })

  it('should now automatically redirect to /graph when location hash/fragment is empty', function() {
    browser.get('')
    expect(browser.getLocationAbsUrl()).toMatch("/graph")
  })

})