
const mongoose = require('mongoose');

const ScriptSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    text: {
        type: String,
        required: true,
    }
},{timestamps: true});

module.exports = mongoose.model('Script', ScriptSchema);
