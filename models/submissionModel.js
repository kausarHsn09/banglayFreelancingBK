const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const submissionSchema = new mongoose.Schema({
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
    tikTokUsername: { type: String, required: true },
    videoLink: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now }
});

submissionSchema.plugin(mongoosePaginate);

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;