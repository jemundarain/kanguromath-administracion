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

app.get('/search_problems',(req, res) => {
	TestModel.aggregate([
		{ $match: { 'edition': req.query.edition } },
		{ $group: { _id: null, problems: { $push: "$problems" } } }
	 ])
	.then((data) => {
		var problems_ids = Array.from(new Set([].concat(...data[0].problems)));
		const regex = new RegExp(req.query.term.replace(/\s+/g, '.*'), 'i');
		ProblemModel.find({ 'problem_id': { $in: problems_ids.filter(problem => regex.test(problem)) } })
		.then((data) => {
			res.json(data);
		})
		.catch(() => {
			console.log('Error fetching entries')
		})
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.put('/put_existing_problem/', (req, res) => {
	TestModel.updateOne({ 'test_id': req.query.test_id }, { $push: { 'problems': req.query.problem_id } })
	.then(() => {
		res.status(200).json({
			message: 'Update completed'
		})    
	})
})

app.post('/post_problem/', (req, res) => {
	var body = req.body;
	var problem = new ProblemModel({
		problem_id: body.problem_id,
    	num_s: body.num_s,
    	statement: body.statement,
    	solution: body.solution,
    	category: body.category,
    	options: body.options,
    	figures: body.figures
	});

	problem.save((err, newProblem) => {
		if(err) {
			return res.status(400).json({
				message: 'post_admin_user error',
				errors: err
			})
		}
		res.status(201).json({
			problem: newProblem
		});
	});
})

app.put('/put_problem/', (req, res) => {
	// x = req.body.figures;
	// x.forEach(object => {
	// 	delete object['_id'];
	//   });
	// console.log(x);
	const updatedProblem = new ProblemModel({_id: req.body._id, problem_id: req.body.problem_id, num_s: req.body.num_s, statement: req.body.statement, solution: req.body.solution, category: req.body.category, options: req.body.options, figures: req.body.figures})
	ProblemModel.updateOne({_id: req.body._id}, updatedProblem)
	.then(() => {
		res.status(200).json({
			message: 'Update completed'
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