const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const contentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    }
})
contentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Content', contentSchema);
