var express = require('express');
var app = express();
const TestModel = require('../schemas/test-schema');
const ProblemModel = require('../schemas/problem-schema');

app.get('/get_problem/:problem_id',(req, res) => {
	ProblemModel.find({ 'problem_id': req.params.problem_id})
	.then((data) => {
		res.json(data[0]);
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.get('/get_all_problems_from_test/:test_id', async (req, res, next) => {
	var problems_id = [];
	var problems = [];
	await TestModel.find({ 'test_id': req.params.test_id })
	.then((data) => {
		problems_id = data[0].problems;
	})
	.catch(() => {
		console.log('Error fetching /problemas/:test_id')
	})
	problems = await ProblemModel.find({ problem_id : { $in : problems_id } });
	res.json(problems.sort((a,b) => a.num_s - b.num_s));
})

app.put('/put_problem/', (req, res) => {
	const updatedProblem = new ProblemModel({_id: req.body._id, problem_id: req.body.test_id, num_s: req.body.num_s, statement: req.body.statement, solution: req.body.solution, category: req.body.category, option: req.body.options, figures: req.body.figures})
	ProblemModel.updateOne({_id: req.body._id}, updatedProblem)
	.then(() => {
		res.status(200).json({
			message: 'Update completed'
		})    
	})
})

module.exports = app;