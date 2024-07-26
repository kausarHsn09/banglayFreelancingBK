const mongoose = require('mongoose');

const nicknameSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Nickname', nicknameSchema);