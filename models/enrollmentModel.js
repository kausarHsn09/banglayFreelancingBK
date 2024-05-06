const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  userBkashNumber:{
    type:Number,
    required:true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid','NotAccepted'],
    default: 'Pending'
  },
  message:{
    type:String,
    required:true,
    default: 'Pending'
  }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
