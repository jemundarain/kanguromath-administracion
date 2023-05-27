var express = require('express');
const UserModel = require('../schemas/user-schema');
const dayjs = require('dayjs')
const bcrypt = require('bcryptjs');

var app = express();

app.post('/post_user/', (req, res) => {

	var body = req.body;

	var user = new UserModel({
		name: body.name,
		last_name: body.last_name,
		username: body.name[0]+body.last_name,
		email: body.email,
		sex: body.sex,
		date_birth: body.date_birth,
		country: body.country,
		state: body.state,
		streak_days: 0,
		type: body.type,
		level: body.level,
		ci: body.ci,
		type_institution: body.type_institution,
		password: bcrypt.hashSync(body.password, 10),
		achieves: [],
		submit: [],
		reminder_hour: body.reminder_hour
	});

	user.save((err, newUser) => {
		if(err) {
			return res.status(400).json({
				message: 'Error al crear usuario',
				errors: err
			})
		}

		res.status(201).json({
			user: newUser
		});
	});
});

app.get('/get_distribution', async (req, res, next) => {
	var startD = dayjs(req.query.start);
	var endD = dayjs(req.query.end);
	var arr = [];
	while(startD.format('YYYY-MM-DD') != endD.add(1, 'day').format('YYYY-MM-DD')) {
		endD_aux = startD.add(1, 'day');
		await UserModel.find({ 'registration_date': {$gte: startD.format('YYYY-MM-DD'), $lte: endD_aux.format('YYYY-MM-DD') }}).count()
		.then((data) => {
			arr.push(data)
		})
		.catch(() => {
			console.log('Error fetching entries /usuarios')
		})
		startD = startD.add(1, 'day');
		setTimeout(() => {}, 50);
	}
	res.json(arr);
})

app.get('/get_total',(req, res, next) => {
	UserModel.find({ 'registration_date': {$gte: new Date(req.query.start), $lt: new Date(req.query.end)}}).count()
	.then((data) => {
		res.json(data)
	})
	.catch(() => {
		console.log('Error fetching entries /users-total')
	})
})

app.get('/get_minimum_date',(req, res, next) => {
	UserModel.find({}, {'_id': 0, 'registration_date': 1}).sort({'registration_date': 1}).limit(1)
	.then((data) => {
		res.json(data[0].registration_date);
	})
	.catch(() => {
		console.log('Error fetching entries /users/minimum-date')
	})
})

app.get('/get_ranking', (req, res, next) => {
	UserModel.aggregate([{$match:{"type":"estudiante", "level": {"$ne": "universitario"}, "country": "venezuela"}}, {$group : { _id : '$state', count : {$sum : 1}}}])
	.then((data) => {
		res.json(data.sort((a, b) => b.count-a.count));
	})
	.catch(() => {
		console.log('Error fetching entries /users/ranking')
	})
})

app.get('/get_distribution_by_type', (req, res, next) => {
	UserModel.aggregate([ {$group : { _id : '$type', count : {$sum : 1}}} ])
	.then((data) => {
		res.json(data);
	})
	.catch(() => {
		console.log('Error fetching entries users/distribution-by-type')
	})
})

app.get('/get_distribution_by_level', (req, res, next) => {
	UserModel.aggregate([ {$group : { _id : '$level', count : {$sum : 1}}} ])
	.then((data) => {
		res.json(data.sort((a,b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0)));
	})
	.catch(() => {
		console.log('Error fetching users/distribution-by-level')
	})
})

app.get('/get_distribution_by_sex', (req, res, next) => {
	UserModel.aggregate([ {$group : { _id : '$sex', count : {$sum : 1}}} ])
	.then((data) => {
		res.json(data.sort((a,b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0)));
	})
	.catch(() => {
		console.log('Error fetching users/distribution-by-sex')
	})
})

app.get('/get_distribution_by_type_institution', (req, res, next) => {
	UserModel.aggregate([ {$group : { _id : '$type_institution', count : {$sum : 1}}} ])
	.then((data) => {
		res.json(data.sort((a,b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0)));
	})
	.catch(() => {
		console.log('Error fetching users/distribution-by-type-institution')
	})
})

module.exports = app;