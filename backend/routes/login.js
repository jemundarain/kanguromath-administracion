var express = require('express');
const AdminUserSchema = require('../schemas/adminUser-schema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var SEED = require('../config').SEED;

var app = express();

app.post('/', (req, res) => {
    var body = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var query = {};

    if (emailRegex.test(body.id)) {
        query.email = body.id;
    } else {
        query.username = body.id;
    }

    AdminUserSchema.findOne(query)
    .then((user) => {
        if (!user || !bcrypt.compareSync(body.password, user.password)) {
            return res.status(400).json({successful: false});
        }
        var token = jwt.sign({ user }, SEED, { expiresIn: 28800 });
        res.status(200).json({
            user,
            token
        });
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});


module.exports = app;