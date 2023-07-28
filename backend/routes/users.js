var express = require('express');
const UserModel = require('../schemas/user-schema');
const dayjs = require('dayjs')

var app = express();

app.get('/get_distribution', async (req, res) => {
    try {
        var startD = dayjs(req.query.start);
        const endD = dayjs(req.query.end);

        const promises = [];

        while (startD.format('YYYY-MM-DD') !== endD.add(1, 'day').format('YYYY-MM-DD')) {
            const endD_aux = startD.add(1, 'day');
            const promise = UserModel.find({ 'registration_date': { $gte: startD.format('YYYY-MM-DD'), $lte: endD_aux.format('YYYY-MM-DD') } }).count();
            promises.push(promise);

            startD = startD.add(1, 'day');
        }

        const results = await Promise.all(promises);
        const arr = results.map((data) => data || 0);

        res.json(arr);
    } catch (err) {
        res.status(500).json(err);
    }
});


app.get('/get_total',(req, res) => {
	UserModel.find({ 'registration_date': {$gte: new Date(req.query.start), $lt: new Date(req.query.end)}}).count()
	.then((data) => {
	    res.status(200).json(data);
	})
	.catch((err) => {
		res.status(500).json(err);
	})
})

app.get('/get_minimum_date',(req, res) => {
	UserModel.find({}, {'_id': 0, 'registration_date': 1}).sort({'registration_date': 1}).limit(1)
	.then((data) => {
		res.json(data[0].registration_date);
	})
	.catch((err) => {
		res.status(500).json(err);
	})
})

app.get('/get_ranking', (req, res) => {
	UserModel.aggregate([{$match:{"type":"estudiante", "level": {"$ne": "universitario"}, "country": "VE"}}, {$group : { _id : '$state', count : {$sum : 1}}}])
	.then((data) => {
		res.json(data.sort((a, b) => b.count-a.count));
	})
	.catch((err) => {
		res.status(500).json(err);
	})
})

app.get('/get_distribution_by_type', (req, res, next) => {
	UserModel.aggregate([ {$group : { _id : '$type', count : {$sum : 1}}} ])
	.then((data) => {
	    res.status(200).json(data);
	})
	.catch((err) => {
		res.status(500).json(err);
	})
})

app.get('/get_distribution_by_level', (req, res, next) => {
	UserModel.aggregate([ {$group : { _id : '$level', count : {$sum : 1}}} ])
	.then((data) => {
		res.status(200).json(data.sort((a,b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0)));
	})
	.catch((err) => {
		res.status(500).json(err);
	})
})

app.get('/get_distribution_by_sex', (req, res, next) => {
	UserModel.aggregate([{$match:{"type":"estudiante"}}, {$group : { _id : '$sex', count : {$sum : 1}}}])
	.then((data) => {
		res.json(data.sort((a,b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0)));
	})
	.catch((err) => {
		res.status(500).json(err);
	})
})

app.get('/get_distribution_by_type_institution', (req, res) => {
	UserModel.aggregate([ {$group : { _id : '$type_institution', count : {$sum : 1}}} ])
	.then((data) => {
		res.json(data.sort((a,b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0)));
	})
	.catch((err) => {
		res.status(500).json(err);
	})
})

module.exports = app;