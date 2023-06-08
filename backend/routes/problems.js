var express = require('express');
var app = express();
const mongoose = require('mongoose');
var ImageKit = require("imagekit");
const { ObjectId } = mongoose.Types;
const TestModel = require('../schemas/test-schema');
const ProblemModel = require('../schemas/problem-schema')

var imagekit = new ImageKit({
	publicKey : 'public_VoBZkirixLnqfCe0fUaeGUj6XQs=',
	privateKey : 'private_mBXoZE1JUrqhmxHZeApipeWtAXc=',
	urlEndpoint : 'https://ik.imagekit.io/661ijdspv/'
});

app.get('/get_problem/:_id',(req, res) => {
	ProblemModel.find({ '_id': req.params._id })
	.then((data) => {
		res.json(data[0]);
	})
	.catch((err) => {
		res.status(500).json(err);
	})
})

app.get('/get_all_problems_from_test/:test_id', async (req, res, next) => {
	const problems_ids = await TestModel.findOne({ 'test_id': req.params.test_id })
	  .then((test) => test?.problems || [])
	  .catch((err) => res.status(500).json(err));
  
	const problems = await ProblemModel.find({ _id: { $in: problems_ids } }).lean();
  
	const problemsMap = problems.reduce((map, problem) => {
	  map[problem._id.toString()] = problem;
	  return map;
	}, {});
  
	res.status(200).json(problems_ids.map((id) => problemsMap[id.toString()]));
});
	
app.get('/search_problems', (req, res) => {
	TestModel.aggregate([
	  { $match: { 'edition': req.query.edition } },
	  { $match: { 'levels': { $ne: req.query.levels } } },
	  { $group: { _id: null, problems: { $push: "$problems" } } }
	])
	.then((data) => {
	  var problems_ids = Array.from(new Set([].concat(...data[0].problems)));
	  ProblemModel.find({
		'_id': { $in: problems_ids },
		'statement': { $regex: req.query.term, $options: 'i' }
	  })
	  .then((data) => {
		res.json(data);
	  })
	  .catch(() => {
		console.log('Error fetching entries /search_problems1');
		res.json([]);
	  });
	})
	.catch(() => {
	  console.log('Error fetching entries /search_problems2');
	  res.json([]);
	});
  });
  

app.put('/put_existing_problem/', (req, res) => {
	TestModel.updateOne({ 'test_id': req.body.test_id }, { $push: { 'problems': req.body._id } })
	.then(() => {
		res.status(200).json({
			message: 'Update completed'
		})    
	})
})

app.post('/post_problem/:test_id', async (req, res) => {
	try {
	  const body = req.body;
	  const problem = new ProblemModel({
		_id: new ObjectId(),
		statement: body.statement,
		solution: body.solution,
		category: body.category,
		options: body.options.map(option => ({ ...option, _id: new ObjectId() })),
		figures: body.figures.map(figure => ({ ...figure, _id: new ObjectId() }))
	  });
	  const newProblem = await problem.save();
	  await TestModel.updateOne({ 'test_id': req.params.test_id }, { $push: { 'problems': problem._id } });
	  res.status(201).json(newProblem);
	} catch (err) {
	  res.status(400).json(err);
	}
});
  

app.put('/put_problem/', (req, res) => {
	const body = req.body;
	const updatedProblem = {
	  statement: body.problem.statement,
	  solution: body.problem.solution,
	  category: body.problem.category,
	  options: body.problem.options.map(option => ({ ...option, _id: new ObjectId() })),
	  figures: body.problem.figures.map(figure => ({ ...figure, _id: new ObjectId() }))
	};
  
	ProblemModel.findByIdAndUpdate(body.problem._id, updatedProblem)
	  .then(() => {
		if(body.num_s !== -1) {
			TestModel.findOne({ 'test_id': body.test_id })
			.then(testModel => {
				if (!testModel) {
				return res.sendStatus(404);
				}
				const problems = testModel.problems;
				const problemIndex = problems.findIndex(problem => problem === body.problem._id);
				if (problemIndex === -1) {
				return res.sendStatus(404);
				}
				problems.splice(problemIndex, 1);
				problems.splice(body.num_s, 0, body.problem._id);
				TestModel.updateOne({ 'test_id': body.test_id }, { problems: problems })
				.then(() => {
					res.status(201).json(updatedProblem);
				})
				.catch(err => {
					res.status(500).json(err);
				});
			})
			.catch(err => {
				res.status(500).json(err);
			});
		}
	  })
	  .catch(err => {
		res.status(500).json(err);
	  });
  });
  
app.delete('/delete_problem', (req, res) => {
	var problem_id = req.query._id;
	TestModel.updateOne(
		{ 'test_id': req.query.test_id },
		{ $pull: { 'problems': problem_id } }
	)
	.then(() => {
		TestModel.findOne({ 'problems': problem_id })
		.then((test) => {
			if (!test) {
				ProblemModel.deleteOne({ '_id': problem_id })
				.then(() => {
					imagekit.deleteFolder(`preliminar/${problem_id}`, function(error, result) {
						if(error) console.log(error);
						else console.log(result);
					});
					res.status(200).json({
						message: 'Delete successful'
					}) 
				})
				.catch((err) => {
					res.status(500).json(err);
				});
			}
		})
	})
	.catch((err) => {
		res.status(500).json(err);
	})
})

module.exports = app;