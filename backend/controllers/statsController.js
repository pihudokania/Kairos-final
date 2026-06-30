const asyncHandler = require('express-async-handler');
const UserStats = require('../models/UserStats');

// Ensures exactly one stats doc exists (single-user demo).
async function getOrCreateStats() {
  let stats = await UserStats.findOne();
  if (!stats) stats = await UserStats.create({});
  return stats;
}

// @desc    Get current live stats (momentum, focus, energy, XP, etc.)
// @route   GET /api/stats
const getStats = asyncHandler(async (req, res) => {
  const stats = await getOrCreateStats();
  res.json({ success: true, data: stats });
});

// @desc    Nudge momentum up/down by a delta, clamped 0-100. This replaces
//          the front end's Math.random() momentum drift with a real,
//          persisted value the server controls.
// @route   PATCH /api/stats/momentum
const nudgeMomentum = asyncHandler(async (req, res) => {
  const stats = await getOrCreateStats();
  const delta = typeof req.body.delta === 'number' ? req.body.delta : (Math.random() - 0.5) * 3;
  stats.momentum = Math.max(0, Math.min(100, stats.momentum + delta));
  await stats.save();
  res.json({ success: true, data: stats });
});

// @desc    Update arbitrary stat fields
// @route   PUT /api/stats
const updateStats = asyncHandler(async (req, res) => {
  const stats = await getOrCreateStats();
  Object.assign(stats, req.body);
  await stats.save();
  res.json({ success: true, data: stats });
});

module.exports = { getStats, nudgeMomentum, updateStats };
