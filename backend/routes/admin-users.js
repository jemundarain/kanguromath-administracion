var express = require('express');
const AdminUserModel = require('../schemas/adminUser-schema');
const bcrypt = require('bcryptjs');
var mdAuthentication = require('../middlewares/authentication');

var app = express();

app.get('/list_admin_users', mdAuthentication.verifyToken, (req, res, next) => {
    AdminUserModel.find({ username: { $ne: 'Jmundarain' } })
    .then((data) => {
		res.json(data)
	})
	.catch(() => {
		console.log('Error get /list_admin_users')
	})
});

app.post('/post_admin_user', mdAuthentication.verifyToken, (req, res) => {
	var body = req.body;
	var user = new AdminUserModel({
		name: body.name,
		last_name: body.last_name,
		username: body.name[0].toUpperCase()+body.last_name.toLowerCase(),
		avatar: body.avatar,
		email: body.email,
		sex: body.sex,
		date_birth: body.date_birth,
		password: bcrypt.hashSync(body.password, 10)
	});

	user.save()
	.then((user) => {
		res.status(201).json(user);
	})
	.catch((err) => {
		res.status(400).json(err);
	})
});

app.put('/put_admin_user/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    AdminUserModel.findById(id)
	.then((user) => {
		if(!user) {
			res.status(404).send('Usuario no encontrado');
		}
		user.name = body.name;
        user.last_name = body.last_name;
        user.username = body.name[0].toUpperCase()+body.last_name.toLowerCase();
		user.avatar = body.avatar;
        user.sex = body.sex;
        user.email = body.email;
        user.date_birth = body.date_birth;
		user.password = bcrypt.hashSync(body.password, 10);
		user.save()
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			res.status(400).json(err);
		})
	})
	.catch(err => {
		res.status(500).json(err);
	})
});

app.delete('/delete_admin_user/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;
    AdminUserModel.findByIdAndRemove(id)
    .then((user) => {
		if(!user) {
			res.status(404).send('Usuario no encontrado');
		}
        res.status(200).send('Prueba eliminada correctamente');
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});

app.get('/get_admin_user/:username', mdAuthentication.verifyToken, (req, res, next) => {
	AdminUserModel.find({ 'username': req.params.username})
	.then((data) => {
		res.json(data[0]);
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

module.exports = app;