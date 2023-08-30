const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const validSexs = {
    values: [ 'F', 'M' ],
    message: '{VALUE} is not an allowed sex'
}

const validTypes = {
    values: [ 'estudiante', 'profesor', 'aficionado' ],
    message: '{VALUE} is not an allowed type'
}

const validLevels = {
    values: [ '1ero', '2do', '3ero', '4to', '5to', 'universitario' ],
    message: '{VALUE} is not an allowed level'
}

const validStates = {
    values: [ 'amazonas', 'anzoategui', 'apure', 'aragua', 'barinas', 'bolivar', 'carabobo', 'cojedes', 'delta-amacuro', 'distrito-capital', 'falcon', 'guarico', 'la-guaira', 'lara', 'merida', 'miranda', 'monagas', 'nueva-esparta', 'portuguesa', 'sucre', 'tachira', 'trujillo', 'yaracuy', 'zulia' ],
    message: '{VALUE} is not an allowed state'
}

const validTypeInstitutions = {
    values: [ 'publica', 'privada' ],
    message: '{VALUE} is not an allowed type institution'
}

const validMode = {
    values: [ 'practica', 'simulacion' ],
    message: '{VALUE} is not an allowed mode'
}

const userSchema = mongoose.Schema({
    registration_date: { type: String, required: true },
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar_url: { type: String },
    sex: { type: String, required: true, enum: validSexs },
    date_birth: { type: Date, required: true },
    country: { type: String},
    state: { type: String, enum: validStates },
    streak_days: { type: Number, required: true },
    type: { type: String, required: true, enum: validTypes },
    level: { type: String, enum: validLevels },
    type_institution: { type: String, enum: validTypeInstitutions },
    achieves: [new mongoose.Schema({
        achievement: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
        counter: { type: Number, required: true }
    })],
    submits: [new mongoose.Schema({
        test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
        mode: { type: String, required: true, enum: validMode },
        difficulty: { type: Number, required: true },
        in_progress: { type: Boolean, required: true },
        t_remain_s: { type: Number },
        score: { type: Number }
    })],
    goal: { type: Number },
    last_goal: { type: String },
    reminder_hour: { type: String },
});

userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('User', userSchema);