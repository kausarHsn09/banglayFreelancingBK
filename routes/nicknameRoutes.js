const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const nicknameController = require('../controllers/nicknameController')

router.get('/',authController.protectRoute, nicknameController.getAllNickname);
router.post('/',authController.protectRoute,authController.restrictToAdmin, nicknameController.createNickname);
router.delete('/:id',authController.protectRoute,authController.restrictToAdmin, nicknameController.deleteNickname);

module.exports = router;