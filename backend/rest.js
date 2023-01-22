const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const bcrypt = require('bcrypt');

const UserModel = require('./schemas/user-schema');
const TestModel = require('./schemas/test-schema');
const ProblemModel = require('./schemas/problem-schema');
//const UserModel = require('./schemas/user-schema');

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

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

/*Dashboard*/
app.get('/usuarios',(req, res, next) => {
    UserModel.find({ 'registration_date': {$gte: new Date(req.query.start), $lt: new Date(req.query.end)}}).count()
    .then((data) => {
        res.json(data);
    })
    .catch(() => {
        console.log('Error fetching entries')
    })
})

app.get('/usuarios/fecha_minima',(req, res, next) => {
    UserModel.find({}, {'_id': 0, 'registration_date': 1}).sort({'registration_date': 1}).limit(1)
    .then((data) => {
        res.json(data[0].registration_date);
    })
    .catch(() => {
        console.log('Error fetching entries')
    })
})

app.get('/ranking',(req, res, next) => {
    UserModel.aggregate([ {$group : { _id : '$state', count : {$sum : 1}}} ])
    .then((data) => {
        res.json(data);
    })
    .catch(() => {
        console.log('Error fetching entries')
    })
})

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
        res.json(data);
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

app.get('/problema/:id',(req, res, next) => {
    ProblemModel.find({ 'problem_id': req.params.id})
    .then((data) => {
        res.json(data);
    })
    .catch(() => {
        console.log('Error fetching entries')
    })
})

app.put('/prueba/editar/:_id', (req, res) => {
    const updatedTest = new TestModel({_id: req.body._id, test_id: req.body.test_id, levels: req.body.levels, edition: req.body.edition, problems: req.body.problems})
    TestModel.updateOne({_id: req.body._id}, updatedTest)
    .then(() => {
        res.status(200).json({
            message: 'Update completed'
        })    
    })
})

app.delete('/prueba/eliminar/:test_id', (req, res) => {
    TestModel.deleteOne({test_id: req.body.test_id})
    .then(() => {
        res.status(200).json({
            message: 'Update completed'
        })   
    })
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

module.exports = app;
