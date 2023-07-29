var express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const TestModel = require('../schemas/test-schema');
const ProblemModel = require('../schemas/problem-schema')
var ImageKit = require('imagekit');

var app = express();

var imagekit = new ImageKit({
	publicKey : 'public_VoBZkirixLnqfCe0fUaeGUj6XQs=',
	privateKey : 'private_mBXoZE1JUrqhmxHZeApipeWtAXc=',
	urlEndpoint : 'https://ik.imagekit.io/661ijdspv/'
});

app.get('/get_problem/:_id',(req, res) => {
	ProblemModel.findOne({ '_id': req.params._id })
	  .then((problem) => {
		res.status(200).json(problem);
	  })
	  .catch((err) => {
		res.status(500).json(err);
	  })
})

app.get('/get_all_problems_from_test/:test_id', (req, res) => {
	TestModel.findOne({ 'test_id': req.params.test_id })
	  .then((test) => {
		if(test && test.problems) {
			const problems_ids = test.problems;
			return ProblemModel.find({ _id: { $in: problems_ids } }).lean()
			.then((problems) => {
				const problemsMap = problems.reduce((map, problem) => {
				map[problem._id.toString()] = problem;
				return map;
				}, {});
				res.status(200).json(problems_ids.map((id) => problemsMap[id.toString()]));
			});
		}
		res.status(200).json([]);
	  })
	  .catch((err) => {
		res.status(500).json(err);
	  });
});   
	
app.get('/search_problems', (req, res) => {
	TestModel.aggregate([
	  { $match: { 'edition': req.query.edition, 'levels': { $ne: req.query.levels } } },
	  { $group: { _id: null, problems: { $push: '$problems' } } }
	])
	.then((data) => {
		const escapeRegex = (text) => {
			return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
		};
		const searchTerm = escapeRegex(req.query.term);
		const problemsIds = Array.from(new Set([].concat(...data[0].problems)));
		return ProblemModel.find({
			'_id': { $in: problemsIds },
			'statement': { $regex: searchTerm, $options: 'i' }
		});
	})
	.then((result) => {
		res.status(200).json(result);
	})
	.catch(() => {
		res.status(500).json([]);
	});
});
  
app.put('/put_existing_problem/', (req, res) => {
	const { test_id, _id } = req.body;
  
	if (!test_id || !_id) {
	  return res.status(400).json({ successful: false, error: 'Missing required fields' });
	}
  
	TestModel.updateOne({ test_id: test_id }, { $push: { problems: _id } })
	  .then(() => {
		res.status(200).json({ successful: true });
	  })
	  .catch((error) => {
		console.error('Error updating test:', error);
		res.status(500).json({ successful: false, error: 'Failed to update test' });
	  });
  });
  

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
		_id: new ObjectId(body.problem._id),
	  statement: body.problem.statement,
	  solution: body.problem.solution,
	  category: body.problem.category,
	  options: body.problem.options.map(option => ({ ...option, _id: new ObjectId() })),
	  figures: body.problem.figures.map(figure => ({ ...figure, _id: new ObjectId() }))
	};
  
	ProblemModel.findByIdAndUpdate(body.problem._id, updatedProblem)
	  .then(() => {
		if(body.num_s !== -1) {
			TestModel.findOne({ '_id': body.test_id })
			.then(testModel => {
				if (!testModel) {
					return res.sendStatus(404);
				}
				const problems = testModel.problems;
				const problemIds = problems.map((objectId) => objectId.toString());
				const problemIndex = problemIds.findIndex(problem => problem === body.problem._id);
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