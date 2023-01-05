const mongoose = require('mongoose');

const optionSubSchema = mongoose.Schema({
    letter: {type: String, required: true},
    answer: {type: Number}
});

module.exports = mongoose.model("Option", optionSubSchema);