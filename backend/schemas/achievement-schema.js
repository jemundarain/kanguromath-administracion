const mongoose = require('mongoose');

const achievementSchema = mongoose.Schema({
    achievement_id: {type: String, required: true},
    title: {type: String, required: true},
    url_image: {type: String, required: true},
    maximum: {type: Number, required: true},
});

module.exports = mongoose.model("Achievement", achievementSchema);