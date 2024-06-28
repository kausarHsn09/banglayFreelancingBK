// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');

router.get('/', categoryController.getAllCategories);
router.delete('/:id', categoryController.deleteCategory);
router.post('/',authController.protectRoute,authController.restrictToAdmin, categoryController.createCategory);

module.exports = router;
