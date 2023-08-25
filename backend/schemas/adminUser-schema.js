const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const validSexs = {
    values: [ 'F', 'M' ],
    message: '{VALUE} is not an allowed sex'
}

const adminUserSchema = mongoose.Schema({
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    avatar: new mongoose.Schema({
        ik_id: { type: String},
        url: { type: String}
    }),
    sex: { type: String, required: true, enum: validSexs },
    email: { type: String, required: true, unique: true },
    date_birth: { type: Date, required: false},
    password: { type: String, required: true },
});

adminUserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('AdminUser', adminUserSchema);