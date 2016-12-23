module.exports = function(config) {
  config.set({

    basePath: './src',

    files: [
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/bootstrap/dist/js/bootstrap.min.js',
      'bower_components/lodash/dist/lodash.min.js',
      'bower_components/async/dist/async.min.js',
      'bower_components/cytoscape/dist/cytoscape.min.js',
      'bower_components/cytoscape-spread/cytoscape-spread.js',
      'bower_components/cytoscape-cose-bilkent/cytoscape-cose-bilkent.js',
      'bower_components/dagre-full/dist/dagre.js',
      'bower_components/cytoscape-dagre/cytoscape-dagre.js',
      'bower_components/angular/angular.min.js',
      'bower_components/angular-route/angular-route.min.js',
      'bower_components/angular-resource/angular-resource.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
      'bower_components/angulartics/dist/angulartics.min.js',
      'bower_components/angulartics-google-analytics/dist/angulartics-ga.min.js',
      'bower_components/json-formatter/dist/json-formatter.min.js',
      'bower_components/angular-google-places-autocomplete/src/autocomplete.js',
      'bower_components/ng-tags-input/ng-tags-input.min.js',
      'bower_components/js-md5/build/md5.min.js',
      'app.js',
      'config.js',
      'controllers/*.js',
      'factories/*.js',
      '../tests/unit/**/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  })
}