const mongoose = require('mongoose');

const problemSchema = mongoose.Schema({
    problem_id: {type: String, required: true, unique: true},
    num_s: {type: Number, required: true},
    statement: {type: String},
    solution: {type: String},
    category: {type: String},
    options: [new mongoose.Schema({
        letter: {type: String, required: true},
        answer: {type: String}
    })],
    figures: [new mongoose.Schema({
        num_s: {type: String, required: true},
        url: {type: String},
        ubication: {type: String}
    })]
});

module.exports = mongoose.model("Problem", problemSchema);