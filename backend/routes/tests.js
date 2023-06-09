var express = require('express');
var app = express();
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const TestModel = require('../schemas/test-schema');
const ProblemModel = require('../schemas/problem-schema')

app.get('/list_tests',(req, res, next) => {
	TestModel.find({})
	.then((data) => {
		res.json(data);
	})
	.catch(() => {
		console.log('Error fetching entries')
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

app.get('/get_leves_available/:edition',(req, res, next) => {
	TestModel.distinct('edition')
	.then((data) => {
		res.json(data);
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.get('/:edition/levels', (req, res) => {
	TestModel.find({ edition: req.params.edition }, 'levels')
	.then(tests => {
		const levels = tests.map(test => test.levels).flat(); 
		res.status(200).json(levels);
	})
	.catch(error => {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	});
});

app.get('/get_tests_by_edition/:edition',(req, res, next) => {
	TestModel.find({ 'edition': req.params.edition})
	.then((data) => {
		res.status(200).json(data);
	})
	.catch(() => {
		console.log('Error fetching entries')
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
	TestModel.find({ 'problems': {$elemMatch: {$eq: decodeURIComponent(req.params._id) }}})
	.then((data) => {
		res.json(data);
	})
	.catch(() => {
		console.log('Error fetching entries')
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
		res.status(200).json({
		  message: 'Update completed'
		});
	  });
});

app.delete('/delete_test/:_id', (req, res) => {
	let prueba;
	let problemasIds;
	TestModel.findById(req.params._id)
	  .then((test) => {
		prueba = test;
		problemasIds = test.problems;
		return TestModel.deleteOne({ _id: req.params._id });
	  })
	  .then(() => {
		return TestModel.distinct("problems", { _id: { $ne: req.params._id }, edition: prueba.edition })
		  .then((result) => {
			return ProblemModel.deleteMany({
				_id: {
					$in: problemasIds,
					$nin: result
				}
			});
		  });
	  })
	  .then(() => {
		res.status(200).json({successful: true});
	  })
	  .catch((err) => {
		res.status(500).json(err);
	  });
});
  
module.exports = app;