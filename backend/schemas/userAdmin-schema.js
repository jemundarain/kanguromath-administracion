const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userAdminSchema = mongoose.Schema({
    name: {type: String, required: true},
    last_name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("UserAdmin", userAdminSchema);