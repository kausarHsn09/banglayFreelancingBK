const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const contentController = require('../controllers/contentController')

router.get('/', contentController.getAllContent);
router.post('/', contentController.createContent);
router.delete('/:id', contentController.deleteContent);

module.exports = router;