const mongoose = require('mongoose');

const problemSchema = mongoose.Schema({
    statement: {type: String},
    solution: {type: String},
    category: {type: String},
    options: [new mongoose.Schema({
        letter: {type: String, required: true},
        answer: {type: String},
        ik_id: {type: String}
    })],
    figures: [new mongoose.Schema({
        ik_id: {type: String},
        num_s: {type: Number, required: true},
        url: {type: String},
        position: {type: String}
    })]
});

module.exports = mongoose.model("Problem", problemSchema);