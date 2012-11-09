var User = require('../models/user.js');

//User.createUser({
//	username:"test2",
//	password:"test"
//},
//function(err,data) {
//
//});
//
//User.startSession("test", function(doc) {
//	console.log(doc);
//});
//
//User.endSession("509c4a0e116b539010000001", function(doc) {
//	console.log('removed:');
//	console.log(doc);
//});

//User.getSession("509c4b5d26bdd1d40e000001", function(doc) {
//	console.log(doc);
//});

//User.validateLogin('test','test1',function(err,doc) {
//	if (err) {console.log(err); return; }
//	console.log(doc);	
//});

exports.index = function(req, res){
  res.send('This is a place holder for the blog');
};

exports.signup = function(req, res){
	res.render('signup', 	{
		username:"",
		password:""
//		password_error:"",
//		email:"",
//		username_error:"",
//		email_error:"",
//		verify_error:""
	});
};

exports.login = function(req, res){
	res.render('login', {
		username:'',
		password:'',
		login_error:''
	});
};
exports.processLogin = function(req, res){
	console.log('process login');
	var mongo = require('mongodb'),
		DB = mongo.connect('mongodb://localhost:27017/blog?safe=true', {}, onconnect);
	
	function onconnect(err,db) {
		var user = req.body;
		console.log(user);
		User.validateLogin(user, function(err,doc) {
			if (err) { 
				console.log(err);
				// not a valid login
				res.render('login', {
					username:user.username,
					password:'',
					login_error:'Invalid Login'
				});
			}
			console.log('sss')
			console.log(doc);
			User.startSession(doc._id,function(user) {
				console.log('session doc');
				console.log(user)
				res.cookie('session', user._id, {signed: true})
				res.redirect('/welcome');
			})
			
		});
	}
};

exports.internal_error = function(req, res){
	res.send({error:"System has encountered a DB error"});
};


exports.logout = function(req, res){
	var mongo = require('mongodb'),
		db = mongo.connect('mongodb://localhost:27017/blog?safe=true', {}, onconnect);

	function onconnect(err,db) {
		var cookie = req.signedCookies.session;
		console.log(cookie);
		if (!cookie) {
			console.log("no cookie...");
			res.redirect("/signup");
			return;
		}
		User.endSession(cookie,function() {
			res.clearCookie('session');
			res.redirect("/signup");
		});

		
	}
};


exports.processSignup = function(req, res){
	var mongo = require('mongodb'),
		db = mongo.connect('mongodb://localhost:27017/blog?safe=true', {}, onconnect);
	console.log(req.body);
	function onconnect(err,db) {
		if (err) { console.log(err); return; }

		var user = req.body;
		var signup = User.validateSignup(user);
console.log(signup);
		if (!signup.isValid) {
			signup.errors.username = user.username;
			signup.errors.email = user.email;
			res.render('signup',signup.errors);
			return;
		}
		User.createUser(user, function(err,doc) {
			if (err) {
				err.username = doc.username;
				err.email = doc.email;
				res.redirect('/signup', err);
				return;
			}
			console.log('creating user session');
			console.log(user);
			console.log(doc);
			User.startSession(user.username,function(user) {
				console.log('starting session');
				console.log(user);
				var sessionId = user._id;
				console.log("A");
				res.cookie('session', sessionId, {signed: true});
				console.log("B");
				res.redirect('/welcome');
			})
		});

	}
};



// will check if the user is logged in and if so, return the username. otherwise, it returns None
function checkLogin(req,callback) {
	var mongo = require('mongodb'),
	db = mongo.connect('mongodb://localhost:27017/blog?safe=true', {}, onconnect);

	function onconnect(err,db) {
		if (err) console.log(err);
		console.log('cehcking login');
		console.log(req.body);
		
		var cookie = req.signedCookies.session;
		console.log(cookie);
		if (!cookie) {
			console.log("no secure cookie...");
			callback();
		}
		else {
			// look up username record
			User.getSession(cookie, function(user) {
				console.log('session:');
				console.log(user);
				callback(user.username);
			});

		}
		
		
	}
};

exports.welcome = function(req, res){
	console.log('welcome');
    // check for a cookie, if present, then extract value
    checkLogin(req,function(username) {
		console.log('username');
		console.log(username);
		
		if (!username) {
			console.log("welcome: can't identify user...redirecting to signup");
			res.redirect("/signup"); return;
		}
		res.render('welcome', {
			username:username
		});
	});
 
};
