const mongoose = require('mongoose');

const problemSchema = mongoose.Schema({
    problem_id: {type: String, required: true, unique: true},
    num_s: {type: Number, required: true},
    statement: {type: String},
    solution: {type: String},
    type: {type: String},
    url_image: {type: String},
    category: {type: String},
    options: [new mongoose.Schema({
        letter: {type: String, required: true},
        answer: {type: String}
    })]
});

module.exports = mongoose.model("Problem", problemSchema);