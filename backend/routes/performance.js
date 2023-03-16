var express = require('express');
var app = express();

app.get('/performance_total/algebra', async (req, res, next) => {
	var answers, problem, good=0, bad=0, arr = [];
	answers = await AnswerModel.find({ 'answer_time': {$gte: req.query.start, $lte: req.query.end }});
	for(let i=0; i<answers.length; i++) {
		problem = await ProblemModel.find({'problem_id': answers[i].problem});
		if(problem[0].category === 'teoria-numeros') {
			answers[i].option === problem[0].solution ? good++ : bad++;
		}
	}
	arr.push({
		'_id': 'Respuestas Correctas',
		'count': good
	});
	arr.push({
		'_id': 'Respuestas Incorrectas',
		'count': bad
	});
	res.json(arr);
})

app.get('/algebra', async (req, res, next) => {
	var startD = dayjs(req.query.start);
	var endD = dayjs(req.query.end);
	var arr = [[],[]];
	var answers, problem, good=0, bad=0;
	while(startD.format('YYYY-MM-DD') != endD.add(1, 'day').format('YYYY-MM-DD')) {
		endD_aux = startD.add(1, 'day');
		answers = await AnswerModel.find({ 'answer_time': { $gte: startD.format('YYYY-MM-DD'), $lte: endD_aux.format('YYYY-MM-DD')}});
		for(let i=0; i<answers.length; i++) {
			problem = await ProblemModel.find({'problem_id': answers[i].problem});
			if(problem[0].category === 'teoria-numeros') {
				answers[i].option === problem[0].solution ? good++ : bad++;
			}
		}
		arr[0].push(good);
		arr[1].push(bad);
		good = 0;
		bad = 0;
		startD = startD.add(1, 'day');
		setTimeout(() => {}, 50);
	}
	res.json(arr)
})

module.exports = app;