const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController'); 
const authController = require("../controllers/authController");

// Route to complete a task
router.put('/complete-task', authController.protectRoute, taskController.completeTask);

// Route to reset tasks daily
router.post('/tasks/reset', authController.protectRoute, taskController.resetTasks);

module.exports = router;
