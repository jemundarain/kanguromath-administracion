const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors')

const GlobalModel = require('./schemas/global-schema');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar rutas
var authRoutes = require('./routes/auth')
var usersRoutes = require('./routes/users');
var adminUsersRoutes = require('./routes/admin-users');
var performanceRoutes = require('./routes/performance');
var testsRoutes = require('./routes/tests');
var problemsRoutes = require('./routes/problems');
var uploadsRoutes = require('./routes/uploads');

mongoose.connect("mongodb+srv://Jemundarain:Cuarentay2@canguromathcluster.azwnjh8.mongodb.net/canguro_math_db?retryWrites=true&w=majority")    
.then(() => {
	console.log('Connected to MongoDB')
})
.catch(() => {
	console.log('Error connecting to MongoDB');
})

if(process.env.ENVIRONMENT !== 'production') {
	require('dotenv').config()
}

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	next();
})

// Rutas
app.use('/auth', authRoutes);
app.use('/admin_users', usersRoutes);
app.use('/admin_admin_users', adminUsersRoutes);
app.use('/performance', performanceRoutes);
app.use('/admin_tests', testsRoutes);
app.use('/admin_problems', problemsRoutes);
app.use('/admin_uploads', uploadsRoutes);

app.use(cors())

/*Settings*/
app.get('/settings/app_state', (req, res) => {
	GlobalModel.findOne({})
	.then((global) => {
		res.status(200).json(global);
	})
	.catch((err) => {
		res.status(500).json(err);
	})
})

app.put('/settings/change_state/', (req, res) => {
	var UpdateGlobal = new GlobalModel({_id: req.body._id, app_enabled: req.body.app_enabled});
	GlobalModel.updateOne({_id: req.body._id}, UpdateGlobal)
	.then(() => {
		res.status(200).json({
			message: 'Update completed'
		})   
	})
})

module.exports = app;
