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
            const promise = UserModel.find({ registration_date: { $gte: startD.format('M/D/YYYY, h:mm:ss A'), $lte: endD_aux.format('M/D/YYYY, h:mm:ss A') } }).count();
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

app.get('/get_total', async (req, res) => {
    try {
        const startDateStr = dayjs(req.query.start);
        const endDateStr = dayjs(req.query.end);

        const count = await UserModel.countDocuments({
            registration_date: {
                $gte: startDateStr.format('M/D/YYYY, h:mm:ss A'),
                $lte: endDateStr.format('M/D/YYYY, h:mm:ss A'),
            },
        });

        res.status(200).json(count);
    } catch (err) {
        res.status(500).json({ successful: false, error: err.message });
    }
});

app.get('/get_minimum_date', async (req, res) => {
    try {
        const data = await UserModel.find({}, { '_id': 0, registration_date: 1 }).sort({ registration_date: 1 }).limit(1);
        res.json(data[0].registration_date);
    } catch (err) {
        res.status(500).json({ successful: false, error: err });
    }
});

app.get('/get_ranking', async (req, res) => {
    try {
        const data = await UserModel.aggregate([
            { $match: { "type": "estudiante", "level": { "$ne": "universitario" }, "country": "VE" } },
            { $group: { _id: '$state', count: { $sum: 1 } } }
        ]);
        res.json(data.sort((a, b) => b.count - a.count));
    } catch (err) {
        res.status(500).json({ successful: false, error: err });
    }
});

app.get('/get_distribution_by_type', async (req, res) => {
    try {
        const data = await UserModel.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ successful: false, error: err });
    }
});

app.get('/get_distribution_by_level', async (req, res) => {
    try {
        const data = await UserModel.aggregate([
            { $group: { _id: '$level', count: { $sum: 1 } } }
        ]);
        res.status(200).json(data.sort((a, b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0)));
    } catch (err) {
        res.status(500).json({ successful: false, error: err });
    }
});

app.get('/get_distribution_by_sex', async (req, res) => {
    try {
        const data = await UserModel.aggregate([
            { $match: { "type": "estudiante" } },
            { $group: { _id: '$sex', count: { $sum: 1 } } }
        ]);
        res.json(data.sort((a, b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0)));
    } catch (err) {
        res.status(500).json({ successful: false, error: err });
    }
});

app.get('/get_distribution_by_type_institution', async (req, res) => {
    try {
        const data = await UserModel.aggregate([
            { $group: { _id: '$type_institution', count: { $sum: 1 } } }
        ]);
        res.json(data.sort((a, b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0)));
    } catch (err) {
        res.status(500).json({ successful: false, error: err });
    }
});

module.exports = app;