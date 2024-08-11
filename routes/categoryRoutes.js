// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');

router.get('/',authController.protectRoute, categoryController.getAllCategories);
router.delete('/:id',authController.protectRoute,authController.restrictToAdmin, categoryController.deleteCategory);
router.post('/',authController.protectRoute,authController.restrictToAdmin, categoryController.createCategory);

module.exports = router;
