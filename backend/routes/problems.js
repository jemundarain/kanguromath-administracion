var express = require('express');
const TestModel = require('../schemas/test-schema');
const ProblemModel = require('../schemas/problem-schema')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
var ImageKit = require('imagekit');

var app = express();

var imagekit = new ImageKit({
	publicKey : 'public_VoBZkirixLnqfCe0fUaeGUj6XQs=',
	privateKey : 'private_mBXoZE1JUrqhmxHZeApipeWtAXc=',
	urlEndpoint : 'https://ik.imagekit.io/661ijdspv/'
});

app.get('/get_problem/:_id', async (req, res) => {
	try {
		const problem = await ProblemModel.findOne({ _id: req.params._id });
		res.status(200).json(problem);
	} catch (err) {
		res.status(500).json({ successful: false, error: err });
	}
});  

app.get('/get_all_problems_from_test/:testId', async (req, res) => {
	try {
		const test = await TestModel.findOne({ test_id: req.params.testId });
  
		if (test && test.problems) {
			const problemsIds = test.problems;
			const problems = await ProblemModel.find({ _id: { $in: problemsIds } }).lean();
	
			const problemsMap = problems.reduce((map, problem) => {
			map[problem._id.toString()] = problem;
			return map;
			}, {});
	
			res.status(200).json(problemsIds.map((id) => problemsMap[id.toString()]));
		} else {
			res.status(200).json([]);
		}
	} catch (err) {
		res.status(500).json({ successful: false, error: err });
	}
});
	
app.get('/search_problems', async (req, res) => {
	try {
		const data = await TestModel.aggregate([
			{ $match: { edition: req.query.edition, levels: { $ne: req.query.levels } } },
			{ $group: { _id: null, problems: { $push: '$problems' } } }
		]);
	
		const escapeRegex = (text) => {
			return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
		};
	
		const searchTerm = escapeRegex(req.query.term);
		const problemsIds = Array.from(new Set([].concat(...data[0].problems)));
	
		const result = await ProblemModel.find({
			_id: { $in: problemsIds },
			statement: { $regex: searchTerm, $options: 'i' }
		});
	
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json([]);
	}
});
  
  
app.put('/put_existing_problem/', async (req, res) => {
	const { testId, _id } = req.body;
  
	try {
		await TestModel.updateOne({ _id: testId }, { $push: { problems: new ObjectId(_id) } });
		res.status(200).json({ successful: true });
	} catch (err) {
		res.status(500).json({ successful: false, error: err });
	}
});
  
app.post('/post_problem/:testId', async (req, res) => {
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
		await TestModel.updateOne({ 'test_id': req.params.testId }, { $push: { 'problems': problem._id } });
		res.status(201).json(newProblem);
	} catch (err) {
		res.status(400).json({ successful: false, error: err });
	}
});

app.put('/put_problem/', async (req, res) => {
	try {
		const body = req.body;
		const updatedProblem = {
			_id: new ObjectId(body.problem._id),
			statement: body.problem.statement,
			solution: body.problem.solution,
			category: body.problem.category,
			options: body.problem.options.map(option => ({ ...option, _id: new ObjectId() })),
			figures: body.problem.figures.map(figure => ({ ...figure, _id: new ObjectId() }))
		};
	
		await ProblemModel.findByIdAndUpdate(body.problem._id, updatedProblem);
	
		if (body.numS !== -1) {
			const testModel = await TestModel.findOne({ _id: body.testId });
	
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
			problems.splice(body.numS, 0, body.problem._id);
	
			await TestModel.updateOne({ test_id: body.testId }, { problems: problems });
		}
	
		res.status(201).json(updatedProblem);
	} catch (err) {
	  res.status(500).json({ successful: false, errors: err });
	}
});  
  
app.delete('/delete_problem', async (req, res) => {
	try {
		const problemId = req.query._id;
	
		await TestModel.updateOne(
			{ test_id: req.query.test_id },
			{ $pull: { problems: problemId } }
		);
	
		const test = await TestModel.findOne({ problems: problemId });
	
		if (!test) {
			await ProblemModel.deleteOne({ _id: problemId });
	
			imagekit.deleteFolder(`preliminar/${problemId}`, function (err, result) {
			if (err) {
				res.status(500).json({ successful: false, errors: err });
			} else {
				res.status(200).json({ successful: true });
			}
			});
		} else {
			res.status(200).json({ successful: true });
		}
	} catch (err) {
	  res.status(500).json({ successful: false, error: err });
	}
});  

module.exports = app;