var mongo = require('mongodb'),
	db = mongo.connect('mongodb://localhost:27017/m101?safe=true',{}, onconnect);

function onconnect(err,db) {
	if (err) console.log(err);

	function doMagic(numbers) {
		var magic = 0;

		numbers.forEach(function(n) {
			if (n.value % 3 === 0) {
				magic += n.value;
			}
		});
		return magic;
	}
	function printResult(err,numbers) {
		if (err) console.log(err);
		console.log("The answer to Homework One, Problem 2 is " + doMagic(numbers));
	}
	db.collection('funnynumbers').find().toArray(printResult);
}
