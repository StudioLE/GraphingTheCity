// Core modules
var p = require('path')
var ver = require('./package.json').version

// Node modules
const { src, dest, parallel } = require('gulp')
var gp_bump = require('gulp-bump')
var gp_clean = require('gulp-clean')
var gp_html = require('gulp-html-replace')
var gp_concat = require('gulp-concat')
var gp_rename = require('gulp-rename')
var gp_uglify = require('gulp-uglify')
var gp_clean_css = require('gulp-clean-css')
var gp_less = require('gulp-less')

var build = {
  /**
   * Format build directory path
   */
  path: function(path) {
    if( ! path) path = ''
    return p.join('build', path)
  },

  /**
   * Format version query string
   */
  version: function() {
    return '?v' + ver
  }
}

// Bump version
const bump = function() {
  return src([
    './bower.json',
    './package.json'
  ])
  .pipe(gp_bump({
    // type:'prerelease'
  }))
  .pipe(dest('./'))
}

// Clean build directory
 const clean = function () {
  return src('build', {
    // read: false
  })
  .pipe(gp_clean())
}

// Build index.html
const index = function() {
  return src('src/index.html')
  .pipe(gp_html({
    'css': 'css/app.css' + build.version(),
    'vendor-css': 'css/vendor.css' + build.version(),
    'js': 'js/app.js' + build.version(),
    'vendor-js': 'js/vendor.js' + build.version()
  }))
  .pipe(dest(build.path()))
}

// Copy static assets
const assets_views = function() {
  // Views
  return src('src/views/*')
  .pipe(dest(build.path('views')))
}

// Data
const assets_data = function() {
  return src('src/data/*')
  .pipe(dest(build.path('data')))
}

// Images
const assets_img = function() {
  return src('src/img/*')
  .pipe(dest(build.path('img')))
}

// Overpass Font
const assets_overpass = function() {
  return src('src/bower_components/overpass/webfonts/overpass-webfont/*')
  .pipe(dest(build.path('css')))
}

// Font Awesome
const assets_fontawesome = function() {
  return src('src/bower_components/font-awesome/fonts/*')
  .pipe(dest(build.path('fonts')))
}

  // Humans.txt
const assets_src = function() {
  return src([
    'src/humans.txt',
    'src/favicon.ico'
  ])
  .pipe(dest(build.path()))
}

// Build app CSS
const css = function() {
  return src('src/css/style.less')
  .pipe(gp_less({ paths: [
    'src/bower_components/bootstrap/less/mixins.less',
    'src/bower_components/bootstrap/less/variables.less'
  ]}))
  .pipe(gp_rename('app.css'))
  .pipe(gp_clean_css({keepSpecialComments: 0}))
  .pipe(dest(build.path('css')))
}

// Build vendor CSS
const vendor_css = function() {
  return src([
    'src/bower_components/bootstrap/dist/css/bootstrap.min.css',
    'src/bower_components/overpass/webfonts/overpass-webfont/overpass.css',
    'src/bower_components/font-awesome/css/font-awesome.min.css',
    'src/bower_components/json-formatter/dist/json-formatter.min.css',
    'src/bower_components/angular-google-places-autocomplete/src/autocomplete.css',
    'src/bower_components/ng-tags-input/ng-tags-input.min.css',
    'src/css/colors.css'
  ])
  .pipe(gp_concat('concat.js'))
  .pipe(gp_rename('vendor.css'))
  .pipe(gp_clean_css({keepSpecialComments: 0}))
  .pipe(dest(build.path('css')))
}

// Build app JS
const js = function() {
  return src([
      'src/app.js',
      'src/config.js',
      'src/controllers/*.js',
      'src/factories/*.js'
    ])
  .pipe(gp_concat('concat.js'))
  .pipe(gp_rename('app.js'))
  // .pipe(gp_uglify())
  .pipe(dest(build.path('js')))
}

// Build vendor JS
const vendor_js = function() {
  return src([
    'src/bower_components/jquery/dist/jquery.min.js',
    'src/bower_components/bootstrap/dist/js/bootstrap.min.js',
    'src/bower_components/lodash/dist/lodash.min.js',
    'src/bower_components/async/dist/async.min.js',
    'src/bower_components/cytoscape/dist/cytoscape.min.js',
    'src/bower_components/cytoscape-spread/cytoscape-spread.js',
    'src/bower_components/cytoscape-cose-bilkent/cytoscape-cose-bilkent.js',
    'src/bower_components/dagre-full/dist/dagre.js',
    'src/bower_components/cytoscape-dagre/cytoscape-dagre.js',
    'src/bower_components/angular/angular.min.js',
    'src/bower_components/angular-route/angular-route.min.js',
    'src/bower_components/angular-resource/angular-resource.min.js',
    'src/bower_components/angular-local-storage/dist/angular-local-storage.min.js',
    'src/bower_components/angulartics/dist/angulartics.min.js',
    'src/bower_components/angulartics-google-analytics/dist/angulartics-ga.min.js',
    'src/bower_components/json-formatter/dist/json-formatter.min.js',
    'src/bower_components/angular-google-places-autocomplete/src/autocomplete.js',
    'src/bower_components/ng-tags-input/ng-tags-input.min.js',
    'src/bower_components/js-md5/build/md5.min.js',
    'src/bower_components/semver/semver.min.js'
  ])
  .pipe(gp_concat('concat.js'))
  .pipe(gp_rename('vendor.js'))
  // .pipe(gp_uglify())
  .pipe(dest(build.path('js')))
}

exports.bump = bump
exports.clean = clean
exports.build = parallel(index, assets_views, assets_data, assets_img, assets_overpass, assets_fontawesome, assets_src, css, vendor_css, js, vendor_js)
exports.default = exports.build
