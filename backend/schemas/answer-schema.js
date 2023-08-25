const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
    hits: { type: [Boolean], default: [null, null, null, null, null] },
    answer_time: { type: String, required: true }
});

module.exports = mongoose.model("Answer", answerSchema);