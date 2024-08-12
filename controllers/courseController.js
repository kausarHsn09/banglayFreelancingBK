const Course = require('../models/courseModel');
const Enrollment = require('../models/enrollmentModel');

// Controller function to create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, stars, price,enrollmentCount,coverImage,author } = req.body;
    const course = new Course({ title, description, price,stars,enrollmentCount,coverImage,author });
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
    const { title, description, price,stars,enrollmentCount,coverImage,author } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    course.title = title;
    course.description = description;
    course.price = price;
    course.stars = stars;
    course.enrollmentCount = enrollmentCount;
    course.coverImage = coverImage;
    course.author = author;
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



exports.getMyCourses = async (req, res) => {
    try {
        // Ensure the user is logged in
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        // Find all enrollments for the user regardless of payment status
        const enrollments = await Enrollment.find({ user: req.userId }).populate('course');
        if (!enrollments.length) {  // Checks if the array is empty
            return res.status(404).json({ message: 'No courses found' });
        }
        // Map the enrollments to include the course and the payment status
        const courseData = enrollments.map(enrollment => ({
            course: enrollment.course,
            paymentStatus: enrollment.paymentStatus,
            enrolledAt: enrollment.enrolledAt,
            status: enrollment.message
        }));
        // Return the courses along with their payment status
        res.json(courseData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
