var express = require('express')
  , blog = require('./routes/blog')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('session'));
  app.use(express.cookieSession({key:'session2',secret:'thisisnotsecret2'}));
  app.use(express.session({key: 'session3', secret:'thisisnotsecret3'}));
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', blog.index);
app.get('/login', blog.login);
app.post('/login', blog.processLogin);
app.get('/signup', blog.signup);
app.post('/signup', blog.processSignup);
app.get('/welcome', blog.welcome);
app.get('/logout', blog.logout);
app.get('/internal_error', blog.internal_error);


http.createServer(app).listen(app.get('port'), function(){
	var ejs = require('ejs');
	ejs.open = '{{';
	ejs.close = '}}';

  console.log("Express server listening on port " + app.get('port'));
});

