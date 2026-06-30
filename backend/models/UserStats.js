const mongoose = require('mongoose');

// Singleton-style document: one record represents "the user's" live stats.
// In a multi-user version this would be keyed by userId; kept simple here
// to match the single-user demo nature of the front end.
const userStatsSchema = new mongoose.Schema(
  {
    momentum: { type: Number, min: 0, max: 100, default: 91 },
    focus: { type: Number, min: 0, max: 100, default: 82 },
    energy: { type: Number, min: 0, max: 100, default: 74 },
    urgency: { type: Number, min: 0, max: 100, default: 91 },
    stress: { type: Number, min: 0, max: 100, default: 38 },
    progress: { type: Number, min: 0, max: 100, default: 65 },
    successProbability: { type: Number, min: 0, max: 100, default: 88 },
    level: { type: Number, default: 12 },
    xp: { type: Number, default: 4240 },
    xpToNextLevel: { type: Number, default: 5000 },
    dayStreak: { type: Number, default: 7 },
    missionsDone: { type: Number, default: 38 },
    successRate: { type: Number, default: 91 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserStats', userStatsSchema);
