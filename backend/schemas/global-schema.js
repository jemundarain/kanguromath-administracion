const mongoose = require('mongoose');

const entrySchema = mongoose.Schema({
    app_enabled: { type: Boolean, required: true },
});

module.exports = mongoose.model('Global', entrySchema);