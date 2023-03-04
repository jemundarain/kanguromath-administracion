var express = require('express');
const UserAdminModel = require('../schemas/userAdmin-schema');
const bcrypt = require('bcryptjs');
var mdAuthentication = require('../middlewares/autenticacion');

var app = express();

app.get('/list_admin_users', (req, res, next) => {
    Usuario.find({}, (err, usuarios) => {
		if (err) {
			return res.status(500).json({
				message: 'list_users error',
				errors: err
			});
		}
		res.status(200).json({
			usuarios
		});
    });
});

app.post('/post_admin_user', (req, res) => {
	var body = req.body;
	var user = new UserAdminModel({
		name: body.name,
		last_name: body.last_name,
		username: body.name[0].toUpperCase()+body.last_name.toLowerCase(),
		email: body.email,
		sex: body.sex,
		date_birth: body.date_birth,
		country: body.country,
		password: bcrypt.hashSync(body.password, 10),
	});

	user.save((err, newAdminUser) => {
		if(err) {
			return res.status(400).json({
				message: 'post_admin_user error',
				errors: err
			})
		}
		res.status(201).json({
			user: newAdminUser
		});
	});
});

app.put('/put_admin_user/:id', mdAuthentication.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    UserAdminModel.findById(id, (err, adminUser) => {
        if (err) {
            return res.status(500).json({
                message: 'put_admin_user error',
				errors: err
            });
        }

        if (!adminUser) {
            return res.status(400).json({
                message: 'El usuario ' + id + ' no existe'
            });
        }

        user.name = body.name;
        user.last_name = body.last_name;
        user.username = body.name[0].toUpperCase()+body.last_name.toLowerCase();
        user.sex = body.sex;
        user.email = body.email;
        user.date_birth = body.date_birth;

        user.save((err, updateUser) => {
            if (err) {
                return res.status(400).json({
                	message: 'El usuario ' + id + ' no existe'
                });
            }
            updateUser.password = '';
            res.status(200).json({
                user: updateUser
            });
        });
    });
});

app.delete('/delete_admin_user/:id', mdAuthentication.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, deleteAdminUser) => {
        if (err) {
            return res.status(500).json({
                message: 'delete_admin_user error',
            });
        }

        if (!deleteAdminUser) {
            return res.status(400).json({
                message: 'El usuario ' + id + ' no existe'
            });
        }

        res.status(200).json({
            user: deleteAdminUser
        });
    });
});

module.exports = app;