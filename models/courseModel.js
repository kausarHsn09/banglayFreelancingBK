const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  coverImage:{
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  stars: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  author:{
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
