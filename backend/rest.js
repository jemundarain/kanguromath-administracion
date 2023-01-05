const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const bcrypt = require('bcrypt');

const TestModel = require('./schemas/test-schema');
//const UserModel = require('./schemas/user-schema');

const app = express();
mongoose.connect("mongodb+srv://Jemundarain:Cuarentay2@canguromathcluster.jwghf.mongodb.net/canguro_math_db?retryWrites=true&w=majority")    
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(() => {
        console.log('Error connecting to MongoDB');
    })

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

/*app.delete('/remove-entry/:id', (req, res) => {
    DiaryEntryModel.deleteOne({_id: req.params.id})
    .then(() => {
        res.status(200).json({
            message: 'Post Deleted'
        })
    })
})

app.put('/update-entry/:id', (req, res) => {
    const updatedEntry = new DiaryEntryModel({_id: req.body.id, date: req.body.date, entry: req.body.entry})
    DiaryEntryModel.updateOne({_id: req.body.id}, updatedEntry)
        .then(() => {
            res.status(200).json({
                message: 'Update completed'
            })    
        })
})

app.post('/add-entry', (req,res) => {
    const diaryEntry = new DiaryEntryModel({date: req.body.date, entry: req.body.entry});
    diaryEntry.save()
        .then(() => {
            res.status(200).json({
                message: 'Post submitted'
            })
        })
})*/

app.get('/pruebas',(req, res, next) => {
    TestModel.find()
    .then((data) => {
        res.json({'pruebas': data});
    })
    .catch(() => {
        console.log('Error fetching entries')
    })
})

app.get('/ediciones',(req, res, next) => {
    TestModel.distinct('edition')
    .then((data) => {
        res.json({'ediciones': data});
    })
    .catch(() => {
        console.log('Error fetching entries')
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
