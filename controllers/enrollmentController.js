const Enrollment = require('../models/enrollmentModel');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');
const Course = require('../models/courseModel');
const Settings = require('../models/settingsModel');
// Controller function to create a new enrollment
exports.createEnrollment = async (req, res) => {
  try {
    const userId = req.userId;
    const { course, userBkashNumber, referralCode } = req.body;

    const existingEnrollment = await Enrollment.findOne({ user: userId, course });
    if (existingEnrollment) {
      return res.status(409).json({ message: 'User is already enrolled in this course' });
    }

    const enrollment = new Enrollment({ user: userId, course, userBkashNumber, referralCodeUsed: referralCode });
    await enrollment.save();

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get all enrollments with pagination and sorted by the latest date
exports.getAllEnrollments = async (req, res) => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const paymentStatus = req.query.paymentStatus; // Optional payment status filter

    const filterOptions = {};
    if (paymentStatus) {
      filterOptions.paymentStatus = paymentStatus; // Add payment status to filter if provided
    }

    const startIndex = (page - 1) * limit;
    const total = await Enrollment.countDocuments(filterOptions); // Count documents based on filters
    const enrollments = await Enrollment.find(filterOptions) // Apply filters to find query
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



exports.confirmPaymentAndUpdateReferral = async (req, res) => {
    const enrollmentId = req.params.id;
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
        return res.status(404).json({ message: 'Enrollment not found' });
    }
    if (enrollment.paymentStatus === "Paid") {
        return res.status(400).json({ message: 'Payment already confirmed' });
    }

    enrollment.paymentStatus = "Paid";
    await enrollment.save();

    if (enrollment.referralCodeUsed) {
        const referrer = await User.findOne({ referralCode: enrollment.referralCodeUsed });
        const courseDetails = await Course.findById(enrollment.course);
        const rewardSetting = await Settings.findOne({ key: 'referralRewardPercentage' });
        const rewardPercentage = rewardSetting ? rewardSetting.value : 10; // Default to 10% if not set

        if (referrer && courseDetails) {
            const rewardAmount = (courseDetails.price * rewardPercentage) / 100;
            referrer.balance += rewardAmount;
            await referrer.save();

            const transaction = new Transaction({
                user: referrer._id,
                amount: rewardAmount,
                type: 'credit',
                status: 'approved'
            });
            await transaction.save();

            // Increment the referral count
            referrer.referralCount = (referrer.referralCount || 0) + 1;
            await referrer.save();
        }
    }

    res.status(200).json({ message: "Payment confirmed and referral reward issued" });
};


