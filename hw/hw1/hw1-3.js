var express = require('express'),
	app = express(),
	mongo = require('mongodb'),
	db = mongo.connect('mongodb://localhost:27017/m101?safe=true',{}, onconnect);

function onconnect(err,db) {
	if (err) console.log(err);

	app.get('/hw/:n', function(req, res){
		var query= {},
			options = { limit:1, skip:req.params.n, sort:"value" };
		function printResult(err,result) {
			if (err) console.log(err);
			res.send("The answer to Homework One, Problem 3 is " + result[0].value);
		}

		db.collection('funnynumbers').find(query,options).toArray(printResult);

	});

	app.listen(3000);
	console.log('Listening on port 3000');
}
