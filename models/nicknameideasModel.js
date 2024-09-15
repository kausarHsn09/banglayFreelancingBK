const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const nicknameSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    }
},{timestamps: true})
nicknameSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Nickname', nicknameSchema);