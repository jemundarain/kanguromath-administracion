var express = require('express');
const AdminUserSchema = require('../schemas/adminUser-schema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var SEED = require('../config').SEED;

var app = express();

app.post('/', (req, res) => {
    var body = req.body;

    AdminUserSchema.findOne( { username: body.username } )
    .then((user) => {
        if(!user) {
			res.status(400).send('Credenciales incorrectas - username');
		}

        if( !bcrypt.compareSync( body.password, user.password)) {
            res.status(400).send('Credenciales incorrectas - password');
        }

        var token = jwt.sign({ user }, SEED, {expiresIn: 1440 } );

        res.status(200).json({
            user,
            token
        });
	})
	.catch((err) => {
        res.status(500).json(err);
	})
});

module.exports = app;