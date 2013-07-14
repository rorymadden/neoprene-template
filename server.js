/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./server/routes')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes
app.get('/api/users', routes.users.list);
app.post('/api/users', routes.users.create);
app.get('/api/users/:id', routes.users.show);
app.put('/api/users/:id', routes.users.edit);
app.del('/api/users/:id', routes.users.del);

app.post('/api/users/:id/follow', routes.users.follow);
app.post('/api/users/:id/unfollow', routes.users.unfollow);

// let angular control the routes
app.get('*', function(req, res){
  res.sendfile('index.html', { root: path.resolve(__dirname, 'app') });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});