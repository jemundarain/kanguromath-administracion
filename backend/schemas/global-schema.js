const mongoose = require('mongoose');

const entrySchema = mongoose.Schema({
    app_enabled: Boolean
});

module.exports = mongoose.model('Global', entrySchema);