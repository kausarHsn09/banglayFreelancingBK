const Course = require('../models/courseModel');

// Controller function to create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, stars, price,enrollmentCount,coverImage } = req.body;
    const course = new Course({ title, description, price,stars,enrollmentCount,coverImage });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get a single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to update a course
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, price,stars,enrollmentCount,coverImage } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    course.title = title;
    course.description = description;
    course.price = price;
    Course.stars = stars;
    Course.enrollmentCount = enrollmentCount;
    Course.coverImage = coverImage;
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete a course
exports.deleteCourse = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(404).json({ message: 'Course not found' });
    }
     await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
