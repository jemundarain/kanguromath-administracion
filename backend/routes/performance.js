var express = require('express');
const AnswerModel = require('../schemas/answer-schema')
const ProblemModel = require('../schemas/problem-schema')

var app = express();

app.get('/algebra', async (req, res, next) => {
	try {
	  if (req.query.start && req.query.end) {
		const start = new Date(req.query.start);
		const end = new Date(req.query.end);
  
		const answers = await AnswerModel.find(
		  { answer_time: { $gte: start, $lte: end } },
		  { problem: 1, option: 1 }
		);
  
		const promises = answers.map(async (answer) => {
		  const problem = await ProblemModel.findOne(
			{ _id: answer.problem },
			{ category: 1, solution: 1 }
		  );
		  return problem;
		});
  
		const results = await Promise.all(promises);
		const problemsAlgebra = results.filter((problem) => problem && problem.category === 'algebra');
  
		let good = 0;
		let bad = 0;
  
		for (let i = 0; i < problemsAlgebra.length; i++) {
		  if (problemsAlgebra[i]) {
			answers[i].option === problemsAlgebra[i].solution ? good++ : bad++;
		  }
		}
  
		const result = [
		  { _id: 'correctas', count: good },
		  { _id: 'incorrectas', count: bad },
		];
  
		res.json(result);
	  } else {
		res.status(400).json({ successful: false });
	  }
	} catch (error) {
	  next(error);
	}
});
  

app.get('/geometria', async (req, res, next) => {
	try {
	  if (req.query.start && req.query.end) {
		const start = new Date(req.query.start);
		const end = new Date(req.query.end);
  
		const answers = await AnswerModel.find(
		  { answer_time: { $gte: start, $lte: end } },
		  { problem: 1, option: 1 }
		);
  
		const promises = answers.map(async (answer) => {
		  const problem = await ProblemModel.findOne(
			{ _id: answer.problem },
			{ category: 1, solution: 1 }
		  );
		  return problem;
		});
  
		const results = await Promise.all(promises);
		const problemsAlgebra = results.filter((problem) => problem && problem.category === 'geometria');
  
		let good = 0;
		let bad = 0;
  
		for (let i = 0; i < problemsAlgebra.length; i++) {
		  if (problemsAlgebra[i]) {
			answers[i].option === problemsAlgebra[i].solution ? good++ : bad++;
		  }
		}
  
		const result = [
		  { _id: 'correctas', count: good },
		  { _id: 'incorrectas', count: bad },
		];
  
		res.json(result);
	  } else {
		res.status(400).json({ successful: false });
	  }
	} catch (error) {
	  next(error);
	}
});

app.get('/combinatoria', async (req, res, next) => {
	try {
	  if (req.query.start && req.query.end) {
		const start = new Date(req.query.start);
		const end = new Date(req.query.end);
  
		const answers = await AnswerModel.find(
		  { answer_time: { $gte: start, $lte: end } },
		  { problem: 1, option: 1 }
		);
  
		const promises = answers.map(async (answer) => {
		  const problem = await ProblemModel.findOne(
			{ _id: answer.problem },
			{ category: 1, solution: 1 }
		  );
		  return problem;
		});
  
		const results = await Promise.all(promises);
		const problemsAlgebra = results.filter((problem) => problem && problem.category === 'combinatoria');
  
		let good = 0;
		let bad = 0;
  
		for (let i = 0; i < problemsAlgebra.length; i++) {
		  if (problemsAlgebra[i]) {
			answers[i].option === problemsAlgebra[i].solution ? good++ : bad++;
		  }
		}
  
		const result = [
		  { _id: 'correctas', count: good },
		  { _id: 'incorrectas', count: bad },
		];
  
		res.json(result);
	  } else {
		res.status(400).json({ successful: false });
	  }
	} catch (error) {
	  next(error);
	}
});

app.get('/teoria_numeros', async (req, res, next) => {
	try {
	  if (req.query.start && req.query.end) {
		const start = new Date(req.query.start);
		const end = new Date(req.query.end);
  
		const answers = await AnswerModel.find(
		  { answer_time: { $gte: start, $lte: end } },
		  { problem: 1, option: 1 }
		);
  
		const promises = answers.map(async (answer) => {
		  const problem = await ProblemModel.findOne(
			{ _id: answer.problem },
			{ category: 1, solution: 1 }
		  );
		  return problem;
		});
  
		const results = await Promise.all(promises);
		const problemsAlgebra = results.filter((problem) => problem && problem.category === 'teoria-numeros');
  
		let good = 0;
		let bad = 0;
  
		for (let i = 0; i < problemsAlgebra.length; i++) {
		  if (problemsAlgebra[i]) {
			answers[i].option === problemsAlgebra[i].solution ? good++ : bad++;
		  }
		}
  
		const result = [
		  { _id: 'correctas', count: good },
		  { _id: 'incorrectas', count: bad },
		];
  
		res.json(result);
	  } else {
		res.status(400).json({ successful: false });
	  }
	} catch (error) {
	  next(error);
	}
});

app.get('/global', async (req, res, next) => {
	try {
	  let answers, problem, good = 0, bad = 0, arr = [];
  
	  if (req.query.start && req.query.end) {
		answers = await AnswerModel.find({ answer_time: { $gte: req.query?.start, $lte: req.query?.end } });
  
		for (let i = 0; i < answers.length; i++) {
		  problem = await ProblemModel.find({ _id: answers[i].problem });
  
		  if (problem[0]) {
			answers[i].option === problem[0].solution ? good++ : bad++;
		  }
		}
  
		arr.push({
		  '_id': 'correctas',
		  'count': good
		});
  
		arr.push({
		  '_id': 'incorrectas',
		  'count': bad
		});
  
		res.json(arr);
	  }
	} catch (err) {
	  next(err);
	}
});

module.exports = app;