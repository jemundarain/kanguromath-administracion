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
	var username;
  
	AdminUserModel.findOne({ username: body.username })
	  .then((adminUser) => {
		if (adminUser) {
		  adminUser.username.includes('.')
			? (username = body.username + '.' + body.username.split('.')[1]++)
			: (username = body.username + '.1');
		} else {
		  username = body.username;
		}
  
		var newAdminUser = new AdminUserModel({
		  name: body.name,
		  last_name: body.last_name,
		  username: username,
		  avatar: body.avatar.url? { ...body.avatar, _id: new ObjectId() } : {},
		  sex: body.sex,
		  date_birth: body.date_birth,
		  email: body.email,
		  password: bcrypt.hashSync(body.password, 10)
		});
  
		newAdminUser
		  .save()
		  .then((adminUser) => {
			res.status(201).json(adminUser);
		  })
		  .catch((err) => {
			res.status(400).json({successful: false});
		  });
	  })
	  .catch((err) => {
		res.status(400).json(err);
	  });
  });
  
  

app.put('/put_admin_user', async (req, res) => {
	try {
		const body = req.body;
	  const adminUser = await AdminUserModel.findOne({ '_id': body._id });
	  if (!adminUser) {
		return res.status(404).send({ successful: false });
	  }
	  
	  adminUser.name = body.name;
	  adminUser.last_name = body.last_name;
	  adminUser.username = body.name[0].toUpperCase() + body.last_name.toLowerCase();
	  adminUser.avatar = { ...body.avatar, _id: new ObjectId() }
	  adminUser.sex = body.sex;
	  adminUser.email = body.email;
	  adminUser.date_birth = body.date_birth;
	  
	  if (body.password) {
		adminUser.password = bcrypt.hashSync(body.password, 10);
	  }
	  
	  const savedAdminUser = await adminUser.save();
	  res.status(200).json(savedAdminUser);
	} catch (err) {
		console.log(err);
	  res.status(500).json(err);
	}
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
		res.status(200).json(adminUser);
	})
	.catch((err) => {
		res.status(500).json(err);
	})
})

module.exports = app;