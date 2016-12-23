# Graphing the City [![Build Status](https://travis-ci.org/StudioLE/GraphingTheCity.svg?branch=master)](https://travis-ci.org/StudioLE/GraphingTheCity)

Extracting the DNA of the city as an identity graph

Find the application at [https://graphingthecity.studiole.uk](https://graphingthecity.studiole.uk)

## Source

This app is run entirely in your browser using [AngularJS](https://angularjs.org).

## Contributing

I'm always on the look out for collaborators so feel free to suggest new features, get in touch or just fork at will.

## Install

If you want to host your own private version or run a local version feel free to follow these [installation instructions](https://github.com/StudioLE/GraphingTheCity/blob/master/INSTALL.md).

## Usage

Run gulp to produce a build from the app source
```
gulp build
```

Launch a web server of the `src` directory
```
http-server src -a localhost -p 1337 -c-1
```

Launch a web server of the `build` directory
```
http-server build -a localhost -p 1337 -c-1
```

Run unit tests and watch for changes
```
npm test
```

Run unit tests only once
```
npm run test-single-run
```

Run end-to-end tests
```
npm run protractor
```
