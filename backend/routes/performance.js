const express = require('express');
const AnswerModel = require('../schemas/answer-schema');
const ProblemModel = require('../schemas/problem-schema');

const app = express();

const getResult = (req, res, next, category) => {
	if (req.query.start && req.query.end) {
	  AnswerModel.find({
		answer_time: { $gte: req.query.start, $lte: req.query.end },
	  })
		.lean()
		.then((answers) => {
		  const problemIds = answers.map((answer) => answer.problem);
		  return ProblemModel.find({ _id: { $in: problemIds }, category }).lean();
		})
		.then((problems) => {
		  let good = 0;
		  let bad = 0;
  
		  for (const answer of answers) {
			const problem = problems.find((p) => p._id.equals(answer.problem));
  
			if (problem) {
			  answer.option === problem.solution ? good++ : bad++;
			}
		  }
  
		  const result = [
			{ _id: 'correctas', count: good },
			{ _id: 'incorrectas', count: bad },
		  ];
  
		  res.status(200).json(result);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
	}
  };

app.get('/algebra', async (req, res, next) => {
  await getResult(req, res, next, 'algebra');
});

app.get('/geometria', async (req, res, next) => {
  await getResult(req, res, next, 'geometria');
});

app.get('/combinatoria', async (req, res, next) => {
  await getResult(req, res, next, 'combinatoria');
});

app.get('/teoria-numeros', async (req, res, next) => {
  await getResult(req, res, next, 'teoria-numeros');
});

app.get('/global', (req, res, next) => {
	if (req.query.start && req.query.end) {
	  AnswerModel.find({
		answer_time: { $gte: req.query.start, $lte: req.query.end },
	  })
		.lean()
		.then((answers) => {
		  const problemIds = answers.map((answer) => answer.problem);
		  return ProblemModel.find({ _id: { $in: problemIds } }).lean();
		})
		.then((problems) => {
		  let good = 0;
		  let bad = 0;
  
		  for (const answer of answers) {
			const problem = problems.find((p) => p._id.equals(answer.problem));
  
			if (problem) {
			  answer.option === problem.solution ? good++ : bad++;
			}
		  }
  
		  const result = [
			{ _id: 'correctas', count: good },
			{ _id: 'incorrectas', count: bad },
		  ];
  
		  res.status(200).json(result);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
	}
  });

module.exports = app;