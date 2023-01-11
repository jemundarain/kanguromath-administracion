const mongoose = require('mongoose');
const Option = require('./option-subSchema');

const problemSchema = mongoose.Schema({
    problem_id: {type: String, required: true, unique: true},
    num_s: {type: Number, required: true},
    statement: {type: String},
    solution: {type: String},
    type: {type: String},
    url_image: {type: String},
    category: {type: String},
    options: {type: mongoose.Schema.Types.ObjectId, ref: 'Option'}
});

module.exports = mongoose.model("Problem", problemSchema);