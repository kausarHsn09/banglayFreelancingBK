const express = require('express');
const router = express.Router();
const scriptController = require('../controllers/scriptController');
const authController = require('../controllers/authController');

router.get('/category/:categoryId',authController.protectRoute, scriptController.getScriptsByCategory);
router.get('/',authController.protectRoute, scriptController.getAllScripts);
router.post('/',authController.protectRoute,authController.restrictToAdmin, scriptController.createScript);
router.delete('/:id',authController.protectRoute,authController.restrictToAdmin, scriptController.deleteScript);

module.exports = router;
