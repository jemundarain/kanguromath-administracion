const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    test_id: {type: String, required: true, unique: true},
    levels: {type: String, required: true},
    edition: {type: String, required: true},
    is_published: {type: Boolean, required: true},
    problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }]
});

module.exports = mongoose.model("Test", testSchema);