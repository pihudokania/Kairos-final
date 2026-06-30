const asyncHandler = require('express-async-handler');
const Achievement = require('../models/Achievement');

// @desc    Get all achievements
// @route   GET /api/achievements
const getAchievements = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find().sort({ createdAt: 1 });
  res.json({ success: true, count: achievements.length, data: achievements });
});

// @desc    Unlock an achievement (called when celebrateAch() fires client-side)
// @route   PATCH /api/achievements/:key/unlock
const unlockAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findOne({ key: req.params.key });
  if (!achievement) {
    res.status(404);
    throw new Error('Achievement not found');
  }
  achievement.unlocked = true;
  achievement.unlockedAt = new Date();
  await achievement.save();
  res.json({ success: true, data: achievement });
});

module.exports = { getAchievements, unlockAchievement };
