const mongoose = require('mongoose');

const validCategory = {
    values: ['algebra', 'geometria', 'combinatoria', 'teoria-numeros', 'sin-categoria'],
    message: '{VALUE} is not an allowed category'
}

const problemSchema = mongoose.Schema({
    statement: { type: String },
    solution: { type: String },
    category: { type: String, requiered: true, enum: validCategory },
    options: [new mongoose.Schema({
        letter: { type: String, required: true },
        answer: { type: String },
        ik_id: { type: String }
    })],
    figures: [new mongoose.Schema({
        ik_id: { type: String },
        num_s: { type: Number, required: true },
        url: { type: String },
        position: { type: String }
    })]
});

module.exports = mongoose.model('Problem', problemSchema);