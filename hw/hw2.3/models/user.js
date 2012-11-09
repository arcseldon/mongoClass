var passwordHash = require('password-hash');

exports.validateSignup = function(user) {
	var validUsername = /^[a-zA-Z0-9_-]{3,20}$/.test(user.username),
		validPassword = /^.{3,20}$/.test(user.password),
		verifiedPassword = (user.password === user.verify),
		validEmail = user.email ==="" || user.email===undefined || /^[\S]+@[\S]+\.[\S]+$/.test(user.email),
		errors = {};

	if (!validUsername) {
		errors.username_error = "invalid username. try just letters and numbers";
	}
 	if (!validPassword) {
		errors.password_error = "invalid password.";
	}
 	if (!verifiedPassword) {
		errors.verify_error = "password must match"
	}
 	if (!validEmail) {
		errors.email_error = "invalid email address";
	}
	return {
		isValid: validUsername && validPassword && verifiedPassword && validEmail,
		errors: errors
	}
}

// validates the login, returns True if it's a valid user login. false otherwise
// to validate a login, the blog must pull the user document and the hashed password
// and compare the password that the user has provided with the hashed password. to do the compare
// we must hash the password that the user is typing now on the login screen
exports.validateLogin = function(user,callback) {
	var mongo = require('mongodb'),
	DB = mongo.connect('mongodb://localhost:27017/blog?safe=true', {}, onconnect);
	function onconnect(err, db) {
		console.log("About to retrieve document from users collection for username ")
		console.log(user.username);
		function foundRecord(err,doc) {
			if (err) { callback("Unable to query database for user"); return; }

			if (!doc) {
				callback("User not in database");
			}
			else {
				if (!passwordHash.verify(user.password,doc.password)) {
					callback("user password is not a match");
				}
				else {
					callback(null, doc);
				}
			}
		}
		
//		# STUDENTS: FILL IN THE NEXT LINE OF CODE. THE TASK IS TO QUERY THE USERS COLLECTION 
//		# COLLECTION USING THE find_one METHOD, QUERYING FOR A USER WHO'S _id IS THE username
//		# PASSED INTO VALIDATE LOGIN. PASS RESULT TO A CALLBACK NAMED foundRecord
//		# XXX


//		# YOUR WORK HERE XXX
//		# use foundRecord as callback (just a suggestion)
//
//		# END OF STUDENT WORK

	}
}

// will start a new session id by adding a new document to the sessions collection
exports.startSession = function(username,callback) {
	var mongo = require('mongodb'),
	DB = mongo.connect('mongodb://localhost:27017/blog?safe=true', {}, onconnect);
	function onconnect(err, db) {
		db.collection('sessions').insert({'username':username}, function(err,doc) {
			if (err) {
				console.log("Unexpected error on start_session: ");
				console.log(err);
				return;
			}
			console.log(doc);
			callback(doc[0]);
		})
	}
}


// will send a new user session by deleting from sessions table
exports.endSession = function(sessionId,callback) {
	var mongo = require('mongodb'),
	DB = mongo.connect('mongodb://localhost:27017/blog?safe=true', {}, onconnect);

	function onconnect(err, db) {
		//collection.findAndModify(criteria, sort, update[, options, callback])
		console.log(sessionId);
		db.collection('sessions').findAndModify({_id:new mongo.ObjectID(sessionId)},{},{},{remove:true}, function(err,doc) {
			if (err) {
				console.log("err removing session doc: ");
				console.log(err);
				return;
			}
			callback(doc);
		})
	}
}


// if there is a valid session, it is returned
exports. getSession = function(sessionId,callback) {
 	var mongo = require('mongodb'),
	DB = mongo.connect('mongodb://localhost:27017/blog?safe=true', {}, onconnect);

	function onconnect(err, db) {

		db.collection('sessions').findOne({_id:new mongo.ObjectID(sessionId)}, function(err,doc) {
			if (err) {
				console.log("err retriving doc: ");
				console.log(err);
				return;
			}
			callback(doc);
		})
	}
}

// creates a new user in the database
exports.createUser = function(user,callback) {
    // the hashed password is what we insert
	var mongo = require('mongodb'),
		DB = mongo.connect('mongodb://localhost:27017/blog?safe=true', {}, onconnect);
	function onconnect(err, db) {
		if (err) console.log(err);
		console.log('start');
		var hashedPassword = passwordHash.generate(user.password),
			data = {'_id':user.username, 'password':hashedPassword};
		if (user.email) { data.email = user.email; }
		
		function userCreated(err,doc) {
			console.log(err);
			if (err) {
				if (err.code === 11000) {
					console.log("oops, username is already taken");
				}
				else {
					console.log("oops, mongo error")		
				}
				callback(err);
			}
			else {
				console.log('success')
				callback(null,doc);
			}
		}
		
//		# STUDENTS:
//		# INSERT THE USER INTO THE users COLLECTION.
//		# DON'T OVER THINK THIS ONE. IT'S A STRAIGHT FORWARD INSERT.
//		# THE USER TO BE INSERTED IS IN THE user VARIABLE. BE SURE TO LOOK AT THE PROTOTYPE
//		# DOC IN THE INSTRUCTIONS

        console.log("about to insert a user into the user collection");
		console.log(data);

//		# XXX YOUR WORK HERE
		console.log("about to insert a user")
//		# use userCreated as callback (just a suggestion)

		

	}
	
}
