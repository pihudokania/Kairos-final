const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true }, // e.g. 'seven-day-streak'
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, default: '🏆' },
    unlocked: { type: Boolean, default: false },
    unlockedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Achievement', achievementSchema);
