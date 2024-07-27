const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const nicknameController = require('../controllers/nicknameController')

router.get('/', nicknameController.getAllNickname);
router.post('/', nicknameController.createNickname);
router.delete('/:id', nicknameController.deleteNickname);

module.exports = router;