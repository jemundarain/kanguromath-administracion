var express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const TestModel = require('../schemas/test-schema');
const ProblemModel = require('../schemas/problem-schema')

var app = express();

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

app.get('/get_tests_by_edition/:edition',(req, res, next) => {
	TestModel.find({ 'edition': req.params.edition})
	.then((tests) => {
		res.status(200).json(tests);
	})
	.catch((err) => {
		res.status(500).json(err);
	})
})

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
	TestModel.create({
		_id: new ObjectId(),
		test_id: body.test_id,
		levels: body.levels,
		edition: body.edition,
		is_published: body.is_published,
		problems: body.problems
	})
	.then(() => {
		res.status(200).json({successful: true});
	})
	.catch(err => {
		res.status(500).json(err);
	});
})

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
  
		return TestModel.deleteOne({ _id: testId })
		  .then(() => TestModel.find({ _id: { $ne: testId }, edition }))
		  .then((tests) => {
			const usedProblemIds = tests.reduce(
			  (acc, curr) => acc.concat(curr.problems.map((problemId) => problemId.toString())),
			  []
			);
  
			const deletePromises = problemsIds
			  .filter((problemId) => !usedProblemIds.includes(problemId))
			  .map((problemId) => ProblemModel.deleteOne({ _id: problemId }));
  
			return Promise.all(deletePromises);
		  });
	  })
	  .then(() => {
		res.status(200).json({ successful: true });
	  })
	  .catch((err) => {
		res.status(500).json(err);
	  });
  });
    
module.exports = app;