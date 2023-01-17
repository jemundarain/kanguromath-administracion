const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    registration_date: {type: Date, required: true},
    name: {type: String, required: true},
    last_name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    gender: {type: String, required: true},
    date_birth: {type: Date, required: true},
    country: {type: String},
    state: {type: String},
    streak_days: {type: Number, required: true},
    type: {type: String, required: true},
    level: {type: String},
    ci: {type: String},
    password: {type: String, required: true},
    institution: {type: String},
    achieves: [new mongoose.Schema({
        achievement: {type: String, required: true},
        percentage: {type: Number, required: true}
    })],
    submit: [new mongoose.Schema({
        test: {type: String, required: true},
        mode: {type: String, required: true},
        in_progress: {type: Boolean, required: true},
        t_remain_s: {type: Number},
    })],
    reminder_hour: {type: Date},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);