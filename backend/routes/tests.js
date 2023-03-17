var express = require('express');
var app = express();
const TestModel = require('../schemas/test-schema');

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
	.then((data) => {
		res.json(data);
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.get('/get_tests_by_edition/:edition',(req, res, next) => {
	TestModel.find({ 'edition': req.params.edition})
	.then((data) => {
		res.json(data);
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.get('/get_test/:id',(req, res, next) => {
	TestModel.find({ 'test_id': req.params.id})
	.then((data) => {
		res.json(data[0]);
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.get('/get_test_by_problem/:problem_id',(req, res) => {
	TestModel.find({ 'problems': {$elemMatch: {$eq: req.params.problem_id }}})
	.then((data) => {
		res.json(data);
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.post('/post_test/', (req, res) => {
	const updatedTest = new TestModel({_id: req.body._id, test_id: req.body.test_id, levels: req.body.levels, edition: req.body.edition, problems: req.body.problems})
	TestModel.updateOne({_id: req.body._id}, updatedTest)
	.then(() => {
		res.status(200).json({
			message: 'Update completed'
		})    
	})
})

app.put('/put_test/', (req, res) => {
	const updatedTest = new TestModel({_id: req.body._id, test_id: req.body.test_id, levels: req.body.levels, edition: req.body.edition, problems: req.body.problems})
	TestModel.updateOne({_id: req.body._id}, updatedTest)
	.then(() => {
		res.status(200).json({
			message: 'Update completed'
		})    
	})
})

app.delete('/delete_test/:_id', (req, res) => {
	TestModel.deleteOne({_id: req.params._id})
	.then(() => {
		res.status(200).json({
			message: 'Delete successful'
		})   
	})
})

app.delete('/delete_problem/:_id', (req, res) => {
	ProblemModel.deleteOne({_id: req.params._id})
	.then(() => {
		res.status(200).json({
			message: 'Delete successful'
		})   
	})
})


module.exports = app;