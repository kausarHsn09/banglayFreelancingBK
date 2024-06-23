
const mongoose = require('mongoose');

const CaptionSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    text: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Caption', CaptionSchema);
