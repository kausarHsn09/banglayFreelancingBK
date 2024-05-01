const mongoose = require('mongoose');

const courseVideoSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  videoUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  isFree: {
    type: Boolean,
    default: false
  },
  isPreview:{
    type: Boolean,
    default: false
  }
});

const CourseVideo = mongoose.model('CourseVideo', courseVideoSchema);

module.exports = CourseVideo;
