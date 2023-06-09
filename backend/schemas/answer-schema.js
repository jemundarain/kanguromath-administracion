const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
    option: {type: String, required: true},
    answer_time: {type: Date}
});

module.exports = mongoose.model("Answer", answerSchema);