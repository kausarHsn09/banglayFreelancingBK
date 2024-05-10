const Enrollment = require('../models/enrollmentModel');

// Controller function to create a new enrollment
exports.createEnrollment = async (req, res) => {
  try {
    const { user, course, userBkashNumber } = req.body;

    // Check if the user is already enrolled in the course
    const existingEnrollment = await Enrollment.findOne({ user: user, course: course });
    
    if (existingEnrollment) {
      return res.status(409).json({ message: 'User is already enrolled in this course' });
    }

    // Create a new enrollment if not already enrolled
    const enrollment = new Enrollment({ user, course, userBkashNumber });
    await enrollment.save();  
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get all enrollments with pagination and sorted by the latest date
exports.getAllEnrollments = async (req, res) => {
  try {
    // Default values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // You can set your own default limit

    const startIndex = (page - 1) * limit;
    const total = await Enrollment.countDocuments(); // Total documents

    const enrollments = await Enrollment.find()
      .sort({ enrolledAt: -1 }) // Sorting by the enrolledAt date in descending order
      .skip(startIndex)
      .limit(limit);

    res.json({
      enrollments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalEnrollments: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get a single enrollment by ID
exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to update a enrollment's payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    enrollment.paymentStatus = req.body.paymentStatus;
    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete a enrollment
exports.deleteEnrollment = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    await Enrollment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};