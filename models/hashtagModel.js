const mongoose = require('mongoose');

const HashtagSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Hashtag', HashtagSchema);
