const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dayjs = require('dayjs')
//const bcrypt = require('bcrypt');
var ImageKit = require("imagekit");
var cors = require('cors')

const UserModel = require('./schemas/user-schema');
const TestModel = require('./schemas/test-schema');
const ProblemModel = require('./schemas/problem-schema');
const GlobalModel = require('./schemas/global-schema');
const AnswerModel = require('./schemas/answer-schema');
//const UserModel = require('./schemas/user-schema');

var imagekit = new ImageKit({
	publicKey : 'public_VoBZkirixLnqfCe0fUaeGUj6XQs=',
	privateKey : 'private_mBXoZE1JUrqhmxHZeApipeWtAXc=',
	urlEndpoint : 'https://ik.imagekit.io/661ijdspv/'
});

const app = express();

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

const STATES = [
	{
		code: "amazonas",
		name: "Amazonas"
	},
	{
		code: "anzoategui",
		name: "Anzoátegui"
	},
	{
		code: "apure",
		name: "Apure"
	},
	{
		code: "aragua",
		name: "Aragua"
	},
	{
		code: "barinas",
		name: "Barinas"
	},
	{
		code: "bolivar",
		name: "Bolívar"
	},
	{
		code: "carabobo",
		name: "Carabobo"
	},
	{
		code: "cojedes",
		name: "Cojedes"
	},
	{
		code: "delta-amacuro",
		name: "Delta Amacuro"
	},
	{
		code: "distrito-capital",
		name: "Distrito Capital"
	},
	{
		code: "falcon",
		name: "Falcón"
	},
	{
		code: "guarico",
		name: "Guárico"
	},
	{
		code: "la-guaira",
		name: "La Guaira"
	},
	{
		code: "lara",
		name: "Lara"
	},
	{
		code: "merida",
		name: "Mérida"
	},
	{
		code: "miranda",
		name: "Miranda"
	},
	{
		code: "monagas",
		name: "Monagas"
	},
	{
		code: "nueva-esparta",
		name: "Nueva Esparta"
	},
	{
		code: "portuguesa",
		name: "Portuguesa"
	},
	{
		code: "sucre",
		name: "Sucre"
	},
	{
		code: "tachira",
		name: "Táchira"
	},
	{
		code: "trujillo",
		name: "Trujillo"
	},
	{
		code: "yaracuy",
		name: "Yaracuy"
	},
	{
		code: "zulia",
		name: "Zulia"
	}
]

app.use(bodyParser.json());
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	next();
})
app.use(cors())

app.get('/imagekit-auth', (req, res) => {
	var authenticationParameters = imagekit.getAuthenticationParameters();
	res.json(authenticationParameters);
})

app.delete('/imagekit-delete/:file_id', (req, res) => {
	imagekit.deleteFile(req.params.file_id, function(error, result) {
		if(error) console.log(error);
		else console.log(result);
	});
})

/*Autenticación*/
app.get('/usuarios-admin/', (req,res) => {

})

/*app.post('/sign-up', (req,res) => {

	bcrypt.hash(req.body.password, 10)
		.then(hash => {
			const userModel = new UserModel({
				username: req.body.username,
				password: hash
			})

			userModel.save()
			.then(result => {
				res.status(201).json({
					message: 'User created',
					result: result
				})
			})
			.catch(err => {
				res.status(500).json({
					error: err
				})
			})
		})
})*/

/*Dashboard*/
app.get('/usuarios-total',(req, res, next) => {
	UserModel.find({ 'registration_date': {$gte: new Date(req.query.start), $lt: new Date(req.query.end)}}).count()
	.then((data) => {
		res.json(data)
	})
	.catch(() => {
		console.log('Error fetching entries /usuarios-total')
	})
})

app.get('/usuarios', async (req, res, next) => {
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

app.get('/usuarios/fecha_minima',(req, res, next) => {
	UserModel.find({}, {'_id': 0, 'registration_date': 1}).sort({'registration_date': 1}).limit(1)
	.then((data) => {
		res.json(data[0].registration_date);
	})
	.catch(() => {
		console.log('Error fetching entries /usuarios/fecha_minima')
	})
})

app.get('/usuarios/ranking', (req, res, next) => {
	UserModel.aggregate([{$match:{"type":"estudiante", "level": {"$ne": "universitario"}, "country": "venezuela"}}, {$group : { _id : '$state', count : {$sum : 1}}}])
	.then((data) => {
		res.json(data);
	})
	.catch(() => {
		console.log('Error fetching entries /usuarios/ranking')
	})
})

app.get('/usuarios/distribution-by-type', (req, res, next) => {
	UserModel.aggregate([ {$group : { _id : '$type', count : {$sum : 1}}} ])
	.then((data) => {
		res.json(data);
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.get('/usuarios/distribution-by-level', (req, res, next) => {
	UserModel.aggregate([ {$group : { _id : '$level', count : {$sum : 1}}} ])
	.then((data) => {
		res.json(data.sort((a,b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0)));
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.get('/usuarios/distribution-by-sex', (req, res, next) => {
	UserModel.aggregate([ {$group : { _id : '$sex', count : {$sum : 1}}} ])
	.then((data) => {
		res.json(data.sort((a,b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0)));
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.get('/usuarios/distribution-by-institution', (req, res, next) => {
	UserModel.aggregate([ {$group : { _id : '$type_institution', count : {$sum : 1}}} ])
	.then((data) => {
		res.json(data.sort((a,b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0)));
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.get('/desempeno-total/algebra', async (req, res, next) => {
	var answers, problem, good=0, bad=0, arr = [];
	answers = await AnswerModel.find({ 'answer_time': {$gte: req.query.start, $lte: req.query.end }});
	for(let i=0; i<answers.length; i++) {
		problem = await ProblemModel.find({'problem_id': answers[i].problem});
		if(problem[0].category === 'teoria-numeros') {
			answers[i].option === problem[0].solution ? good++ : bad++;
		}
	}
	arr.push({
		'_id': 'Respuestas Correctas',
		'count': good
	});
	arr.push({
		'_id': 'Respuestas Incorrectas',
		'count': bad
	});
	res.json(arr);
})

app.get('/desempeno/algebra', async (req, res, next) => {
	var startD = dayjs(req.query.start);
	var endD = dayjs(req.query.end);
	var arr = [[],[]];
	var answers, problem, good=0, bad=0;
	while(startD.format('YYYY-MM-DD') != endD.add(1, 'day').format('YYYY-MM-DD')) {
		endD_aux = startD.add(1, 'day');
		answers = await AnswerModel.find({ 'answer_time': { $gte: startD.format('YYYY-MM-DD'), $lte: endD_aux.format('YYYY-MM-DD')}});
		for(let i=0; i<answers.length; i++) {
			problem = await ProblemModel.find({'problem_id': answers[i].problem});
			if(problem[0].category === 'teoria-numeros') {
				answers[i].option === problem[0].solution ? good++ : bad++;
			}
		}
		arr[0].push(good);
		arr[1].push(bad);
		good = 0;
		bad = 0;
		startD = startD.add(1, 'day');
		setTimeout(() => {}, 50);
	}
	res.json(arr)
})


/*Pruebas*/
app.get('/pruebas',(req, res, next) => {
	TestModel.find({})
	.then((data) => {
		res.json(data);
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.get('/ediciones',(req, res, next) => {
	TestModel.distinct('edition')
	.then((data) => {
		res.json(data);
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.get('/pruebas/:edition',(req, res, next) => {
	TestModel.find({ 'edition': req.params.edition})
	.then((data) => {
		res.json(data);
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.get('/prueba/:id',(req, res, next) => {
	TestModel.find({ 'test_id': req.params.id})
	.then((data) => {
		res.json(data[0]);
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.get('/prueba/problema/:id',(req, res, next) => {
	TestModel.find({ 'problems': {$elemMatch: req.params.id}})
	.then((data) => {
		res.json(data);
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.get('/problemas/:test_id', async (req, res, next) => {
	var problems_id = [];
	var problems = [];
	await TestModel.find({ 'test_id': req.params.test_id })
	.then((data) => {
		problems_id = data[0].problems;
	})
	.catch(() => {
		console.log('Error fetching /problemas/:test_id')
	})
	problems = await ProblemModel.find({ problem_id : { $in : problems_id } });
	res.json(problems.sort((a,b) => a.num_s - b.num_s));
})

app.get('/problema/:problem_id',(req, res, next) => {
	ProblemModel.find({ 'problem_id': req.params.problem_id})
	.then((data) => {
		res.json(data[0]);
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.put('/prueba/editar/', (req, res) => {
	const updatedTest = new TestModel({_id: req.body._id, test_id: req.body.test_id, levels: req.body.levels, edition: req.body.edition, problems: req.body.problems})
	TestModel.updateOne({_id: req.body._id}, updatedTest)
	.then(() => {
		res.status(200).json({
			message: 'Update completed'
		})    
	})
})

app.delete('/prueba/eliminar/:_id', (req, res) => {
	TestModel.deleteOne({_id: req.params._id})
	.then(() => {
		res.status(200).json({
			message: 'Delete successful'
		})   
	})
})

app.put('/problema/editar/', (req, res) => {
	const updatedProblem = new ProblemModel({_id: req.body._id, problem_id: req.body.test_id, num_s: req.body.num_s, statement: req.body.statement, solution: req.body.solution, category: req.body.category, option: req.body.options, figures: req.body.figures})
	ProblemModel.updateOne({_id: req.body._id}, updatedProblem)
	.then(() => {
		res.status(200).json({
			message: 'Update completed'
		})    
	})
})



/*Settings*/
app.get('/ajustes/estado-app', (req, res) => {
	GlobalModel.find({})
	.then((data) => {
		res.json(data[0]);
	})
	.catch(() => {
		console.log('Error fetching entries')
	})
})

app.put('/ajustes/cambiar-estado/', (req, res) => {
	var UpdateGlobal = new GlobalModel({_id: req.body._id, app_enabled: req.body.app_enabled});
	GlobalModel.updateOne({_id: req.body._id}, UpdateGlobal)
	.then(() => {
		res.status(200).json({
			message: 'Update completed'
		})   
	})
})

module.exports = app;
