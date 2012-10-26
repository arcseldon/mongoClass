var express = require('express'),
	mongo = require('mongodb'),
	app = express(),
	db = mongo.connect('mongodb://localhost:27017/test?safe=true',{}, onconnect);

function onconnect(err,db) {
	if (err) console.log(err);

	app.get('/', function(req, res){
		function hello(err,person) {
			res.send('Hello '+person.name);
		}
		db.collection('people').findOne({},hello);

	});

	app.listen(3000);
	console.log('Listening on port 3000');
}

