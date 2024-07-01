const Course = require('../models/courseModel');
const Enrollment = require('../models/enrollmentModel');
const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');

exports.getDashboardStats = async (req, res) => {
    try {
        // Total Registered Users
        const totalUsers = await User.countDocuments();

        
       // Total Earnings from Courses (sum of prices from paid enrollments)
        const totalEarnings = await Enrollment.aggregate([
            { $match: { paymentStatus: 'Paid' } },
            { $lookup: {
                from: 'courses', // Make sure this matches the actual name of your courses collection in MongoDB
                localField: 'course', // The field in enrollments that refers to the course
                foreignField: '_id', // The corresponding field in courses
                as: 'courseDetails'
            }},
            { $unwind: '$courseDetails' }, // Unwind the array to simplify processing
            { $group: {
                _id: null,
                total: { $sum: '$courseDetails.price' } // Sum the price from the course details
            }}
        ]);

        // Total Enrollments (only those paid)
        const totalPaidEnrollments = await Enrollment.countDocuments({ paymentStatus: 'Paid' });

        // Total Referral Money (assuming a Transaction type 'credit' is used for referral payments)
        const totalReferralMoney = await Transaction.aggregate([
            { $match: { type: 'credit' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.json({
            totalUsers: totalUsers,
            totalEarnings: totalEarnings[0] ? totalEarnings[0].total : 0,
            totalPaidEnrollments: totalPaidEnrollments,
            totalReferralMoney: totalReferralMoney[0] ? totalReferralMoney[0].total : 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve dashboard stats', error: error.message });
    }
};
