const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const talentHuntController = require('../controllers/talentHuntController')

router.get('/', talentHuntController.getAllTalent);
router.post('/', talentHuntController.createTalentHunt);
router.patch('/:id', talentHuntController.updateStatus);

module.exports = router;