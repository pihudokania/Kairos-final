const express = require('express');
const router = express.Router();
const { getAchievements, unlockAchievement } = require('../controllers/achievementController');

router.get('/', getAchievements);
router.patch('/:key/unlock', unlockAchievement);

module.exports = router;
