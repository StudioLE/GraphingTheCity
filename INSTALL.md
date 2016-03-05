## Install

Clone the repository

```
git clone https://gitlab.com/StudioLE/CityGraph.git CityGraph
```

Enter the directory and install the dependencies. For this step you'll need to have [Node.js](https://nodejs.org/) and [bower](http://bower.io/) installed.

```
cd CityGraph
npm install
```

Behind the scenes this will also call `bower install`.

Now run the default gulp task to produce an up to date build

```
gulp build
```

Now point your websever to either the `build` or `src` directories.

Or you run the bundled node server which will launch the app to `http://localhost:1337`

```
node cli server src
node cli server build
```
