const express = require('express');
const router = express.Router();
const scriptController = require('../controllers/scriptController');
const authController = require('../controllers/authController');

router.get('/category/:categoryId', scriptController.getScriptsByCategory);
router.get('/', scriptController.getAllScripts);
router.post('/',authController.protectRoute, scriptController.createScript);
router.delete('/:id', scriptController.deleteScript);

module.exports = router;
