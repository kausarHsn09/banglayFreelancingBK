
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    caption: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Caption',
        required: true,
    },
    hashtags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hashtag',
    }]
});

module.exports = mongoose.model('Post', PostSchema);
