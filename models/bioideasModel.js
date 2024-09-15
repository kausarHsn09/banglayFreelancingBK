const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const bioSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    }
},{timestamps: true})
bioSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Bio', bioSchema);
