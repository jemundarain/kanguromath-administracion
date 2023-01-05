const mongoose = require('mongoose');

const submitSubSchema = mongoose.Schema({
    test: {type: String, required: true},
    mode: {type: String, required: true},
    in_progress: {type: Boolean, required: true},
    t_remain_s: {type: Number, required: true},
});

module.exports = mongoose.model("Submit", submitSubSchema);