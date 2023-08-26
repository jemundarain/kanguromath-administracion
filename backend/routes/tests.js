var express = require('express');
const TestModel = require('../schemas/test-schema');
const ProblemModel = require('../schemas/problem-schema')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
var ImageKit = require("imagekit");

var app = express();

var imagekit = new ImageKit({
	publicKey : 'public_VoBZkirixLnqfCe0fUaeGUj6XQs=',
	privateKey : 'private_mBXoZE1JUrqhmxHZeApipeWtAXc=',
	urlEndpoint : 'https://ik.imagekit.io/661ijdspv/'
});

app.get('/list_tests', async (req, res) => {
	try {
		const tests = await TestModel.find({});
		res.status(200).json(tests);
	} catch (err) {
		res.status(500).json({ successful: false, error: err });
	}
});  

app.get('/get_editions', async (req, res) => {
	try {
		const editions = await TestModel.distinct('edition');
		res.status(200).json(editions);
	} catch (err) {
	  res.status(500).json({ successful: false, error: err });
	}
});  

app.get('/:edition/levels', async (req, res) => {
	try {
	  const tests = await TestModel.find({ edition: req.params.edition }, 'levels');
	  const levels = tests.map(test => test.levels).flat();
	  res.status(200).json(levels);
	} catch (err) {
	  res.status(500).json({ successful: false, errors: err });
	}
});  

app.get('/get_tests_by_edition/:edition', async (req, res) => {
	try {
		const tests = await TestModel.find({ edition: req.params.edition }).sort({ levels: 1 });
		res.status(200).json(tests);
	} catch (err) {
	  res.status(500).json({ successful: false, error: err });
	}
});  

app.get('/get_test/:testId', async (req, res) => {
	try {
		const test = await TestModel.findOne({ test_id: req.params.testId });
		res.status(200).json(test);
	} catch (err) {
		res.status(500).json({ successful: false, error: err });
	}
});  

app.get('/get_test_by_problem/:_id', async (req, res) => {
	try {
		const test = await TestModel.find({ problems: { $elemMatch: { $eq: new ObjectId(req.params._id) } } });
		res.status(200).json(test);
	} catch (err) {
		res.status(500).json({ successful: false, error: err });
	}
});  

app.post('/post_test/', async (req, res) => {
	try {
		const body = req.body;
		const testId = new ObjectId();
	
		await TestModel.create({
			_id: testId,
			test_id: body.test_id,
			levels: body.levels,
			edition: body.edition,
			is_published: body.is_published,
			problems: body.problems
		});
	
		res.status(200).json({ successful: true, test_id: testId });
	} catch (err) {
	  res.status(500).json({ successful: false, error: err });
	}
});

app.put('/put_test/', async (req, res) => {
	try {
	  await TestModel.updateOne({ _id: req.body._id }, req.body);
	  res.status(200).json({ successful: true });
	} catch (err) {
	  res.status(500).json({ successful: false, error: err });
	}
});  

app.delete('/delete_test/:_id', async (req, res) => {
	try {
		const testId = req.params._id;
		const test = await TestModel.findById(testId);
	
		if (!test) {
			return res.status(404).json({ successful: false });
		}
	
		const edition = test.edition;
		const problemsIds = test.problems.map((problemId) => problemId.toString());
	
		await TestModel.deleteOne({ _id: testId });
		const tests = await TestModel.find({ edition });
	
		const usedProblemIds = tests.reduce(
			(acc, curr) => acc.concat(curr.problems.map((problemId) => problemId.toString())),
			[]
		);
	
		const deleteIds = problemsIds.filter((problemId) => !usedProblemIds.includes(problemId));
		const deletePromises = deleteIds.map((problemId) => ProblemModel.deleteOne({ _id: problemId }));
		await Promise.all(deletePromises);
	
		deleteIds.forEach((problemId) => {
			imagekit.deleteFolder(`preliminar/${problemId}`, function (error, result) {});
		});
	
		res.status(200).json({ successful: true });
	} catch (err) {
		res.status(500).json({ successful: false, errors: err });
	}
});  
  
module.exports = app;