const asyncHandler = require('express-async-handler');
const Reflection = require('../models/Reflection');

// @desc    Get all nightly reflections, newest first
// @route   GET /api/reflections
const getReflections = asyncHandler(async (req, res) => {
  const reflections = await Reflection.find().sort({ date: -1 });
  res.json({ success: true, count: reflections.length, data: reflections });
});

// @desc    Create a reflection entry
// @route   POST /api/reflections
const createReflection = asyncHandler(async (req, res) => {
  const { body, tags } = req.body;
  if (!body || !body.trim()) {
    res.status(400);
    throw new Error('Reflection body is required');
  }
  const reflection = await Reflection.create({ body: body.trim(), tags: tags || [] });
  res.status(201).json({ success: true, data: reflection });
});

module.exports = { getReflections, createReflection };
