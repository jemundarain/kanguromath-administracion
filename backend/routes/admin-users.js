var express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const bcrypt = require('bcryptjs');
const AdminUserModel = require('../schemas/adminUser-schema');

var app = express();

app.get('/list_admin_users', (req, res) => {
    AdminUserModel.find({ username: { $ne: 'Jmundarain' } })
    .then((adminUsers) => {
		res.status(200).json(adminUsers);
	})
	.catch((err) => {
		res.status(500).json(err);
	})
});

app.post('/post_admin_user', (req, res) => {
	var body = req.body;
	var adminUser = new AdminUserModel({
		name: body.name,
		last_name: body.last_name,
		username: body.name[0].toUpperCase()+body.last_name.toLowerCase(),
		avatar: {...body.avatar, _id:  new ObjectId()},
		email: body.email,
		sex: body.sex,
		date_birth: body.date_birth,
		password: bcrypt.hashSync(body.password, 10)
	});
	
	adminUser.save()
	.then((adminUser) => {
		res.status(201).json(adminUser);
	})
	.catch((err) => {
		res.status(400).json(err);
	})
});

app.put('/put_admin_user/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    AdminUserModel.findById(id)
	.then((adminUser) => {
		if(!adminUser) {
			res.status(404).send('Usuario no encontrado');
		}
		adminUser.name = body.name;
        adminUser.last_name = body.last_name;
        adminUser.username = body.name[0].toUpperCase()+body.last_name.toLowerCase();
		adminUser.avatar = body.avatar;
        adminUser.sex = body.sex;
        adminUser.email = body.email;
        adminUser.date_birth = body.date_birth;
		adminUser.password = bcrypt.hashSync(body.password, 10);
		adminUser.save()
		.then((adminUser) => {
			res.status(200).json(adminUser);
		})
		.catch((err) => {
			res.status(400).json(err);
		})
	})
	.catch(err => {
		res.status(500).json(err);
	})
});

app.delete('/delete_admin_user/:id', (req, res) => {
    AdminUserModel.findByIdAndRemove(req.params.id)
    .then((adminUser) => {
		if(!adminUser) {
			res.status(404).send({successful: false});
		}
		res.status(200).json({successful: true});
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});

app.get('/get_admin_user/:username', (req, res) => {
	AdminUserModel.findOne({ 'username': req.params.username})
	.then((adminUser) => {
		if(!adminUser) {
			res.status(404).send({successful: false});
		}
		res.status(200).json({successful: true});
	})
	.catch(() => {
		res.status(500).json(err);
	})
})

module.exports = app;