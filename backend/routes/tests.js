var express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const TestModel = require('../schemas/test-schema');
const ProblemModel = require('../schemas/problem-schema')
var ImageKit = require("imagekit");

var app = express();

var imagekit = new ImageKit({
	publicKey : 'public_VoBZkirixLnqfCe0fUaeGUj6XQs=',
	privateKey : 'private_mBXoZE1JUrqhmxHZeApipeWtAXc=',
	urlEndpoint : 'https://ik.imagekit.io/661ijdspv/'
});

app.get('/list_tests',(req, res, next) => {
	TestModel.find({})
	.then((tests) => {
		res.status(200).json(tests);
	})
	.catch((err) => {
		res.status(500).json(err);
	})
})

app.get('/get_editions',(req, res, next) => {
	TestModel.distinct('edition')
	.then((editions) => {
		res.status(200).json(editions);
	})
	.catch((err) => {
		res.status(500).json(err);
	})
})

app.get('/:edition/levels', (req, res) => {
	TestModel.find({ edition: req.params.edition }, 'levels')
	.then(tests => {
		res.status(200).json(tests.map(test => test.levels).flat());
	})
	.catch(err => {
		res.status(500).json(err);
	});
});

app.get('/get_tests_by_edition/:edition', (req, res) => {
	TestModel.find({ 'edition': req.params.edition })
	  .sort({ 'levels': 1 })
	  .then((tests) => {
		res.status(200).json(tests);
	  })
	  .catch((err) => {
		res.status(500).json(err);
	  });
});  

app.get('/get_test/:test_id',(req, res, next) => {
	TestModel.findOne({ 'test_id': req.params.test_id})
	.then((test) => {
		res.status(200).json(test);
	})
	.catch((err) => {
		res.status(400).json(err);
	})
})

app.get('/get_test_by_problem/:_id', (req, res) => {
	TestModel.find({ 'problems': {$elemMatch: {$eq: new ObjectId(req.params._id) }}})
	.then((test) => {
		res.status(200).json(test);
	})
	.catch(() => {
		res.status(400).json(err);
	})
})

app.post('/post_test/', (req, res) => {
	const body = req.body;
	const testId = new ObjectId();
  
	TestModel.create({
	  _id: testId,
	  test_id: body.test_id,
	  levels: body.levels,
	  edition: body.edition,
	  is_published: body.is_published,
	  problems: body.problems
	})
	.then(() => {
		res.status(200).json({ successful: true, test_id: testId });
	})
	.catch(err => {
		res.status(500).json({ successful: false, errors: err });
	});
});  

app.put('/put_test/', (req, res) => {
	TestModel.updateOne({_id: req.body._id}, req.body)
	.then(() => {
		res.status(200).json({successful: true});
	})
	.catch(err => {
		res.status(500).json(err);
	});
});

app.delete('/delete_test/:_id', (req, res) => {
	const testId = req.params._id;
  
	TestModel.findById(testId)
	  .then((test) => {
		const edition = test.edition;
		const problemsIds = test.problems.map((problemId) => problemId.toString());
  
		TestModel.deleteOne({ _id: testId })
		  .then(() => TestModel.find({ edition }))
		  .then((tests) => {
			const usedProblemIds = tests.reduce(
			  (acc, curr) => acc.concat(curr.problems.map((problemId) => problemId.toString())),
			  []
			);
  
			const deletePromises = problemsIds
			  .filter((problemId) => !usedProblemIds.includes(problemId))
			  .map((problemId) => ProblemModel.deleteOne({ _id: problemId }));
  
			Promise.all(deletePromises)
			.then(() => {
				const deleteIds = problemsIds.filter((problemId) => !usedProblemIds.includes(problemId))
				deleteIds.forEach((problemId) => {
					imagekit.deleteFolder(`preliminar/${problemId}`, function(error, result) {
						if(error) console.log(error);
						else console.log(result);
					});
				});				  
				res.status(200).json({ successful: true });
			})
			.catch((err) => {
				res.status(500).json(err);
			});
		  });
	  })
  });
    
module.exports = app;