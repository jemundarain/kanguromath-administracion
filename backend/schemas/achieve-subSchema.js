const mongoose = require('mongoose');

const achieveSubSchema = mongoose.Schema({
    achievement: {type: String, required: true},
    percentage: {type: Number, required: true}
});

module.exports = mongoose.model("Achieve", achieveSubSchema);