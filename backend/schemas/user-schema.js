const mongoose = require('mongoose');
const Achieve = require('./schemas/achieve-subSchema');
const Submit = require('./schemas/submit-subSchema');

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    registration_date: {type: String, required: true},
    name: {type: String, required: true},
    last_name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    gender: {type: String, required: true},
    date_birth: {type: Date, required: true},
    country: {type: String, required: true},
    state: {type: String, required: true},
    streak_days: {type: Number, required: true},
    type: {type: String, required: true},
    level: {type: String, required: true},
    ci: {type: String},
    password: {type: String, required: true},
    institution: {type: String, required: true},
    achieves: {type: Achieve},
    submit: {type: Submit},
    reminder_hour: {type: Date},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);