const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
    user: {type: String, required: true},
    problem: {type: String, required: true},
    option: {type: String, required: true},
    answer_time: {type: Date}
});

module.exports = mongoose.model("Answer", answerSchema);