# Neoprene Template

This is a template app showing the use of [Neo4j][] from Node.js. It uses the
[neoprene][] library, available on npm as `neoprene`.

The app is a simple social network manager: it lets you add and remove users
and "follows" relationships between them.

This app supports deploying to Heroku, and a demo is in fact running live at
[http://neoprene-template.herokuapp.com//](http://neoprene-template.herokuapp.com//).

So try it out, browse the code, and fork this project to get a head start on
creating your own Node-Neo4j app. Enjoy!


# Installation

```bash
## Install the required dependencies
npm install

bower install

## Install a local Neo4j instance (MUST BE > 2.0)
[Neo4j download][]. The community edition is the best to choose for now.

```


# Usage

```bash
## Start the local Neo4j instance
./neo4j start

## Run the app!
npm start
```

The app will now be accessible at [http://localhost:3000/](http://localhost:3000/).

The UI is done with AngularJS. If this is confusing for you, sorry. The interesting code is in the 'server' folder anyway. If there are big problems with the angul front end let me know and I'll create a basic version as well.


# Others

- MIT license.
- Questions/comments/etc. are welcome.


[Neo4j]: http://www.neo4j.org/
[neoprene]: https://github.com/rorymadden/neoprene
[Neo4j download]: http://www.neo4j.org/download

