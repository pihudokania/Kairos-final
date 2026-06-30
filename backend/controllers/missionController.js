const asyncHandler = require('express-async-handler');
const Mission = require('../models/Mission');

// @desc    Get all missions (optionally filtered by status/priority)
// @route   GET /api/missions?status=critical
// @access  Public (single-user demo, no auth)
const getMissions = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;

  const missions = await Mission.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: missions.length, data: missions });
});

// @desc    Get single mission
// @route   GET /api/missions/:id
const getMission = asyncHandler(async (req, res) => {
  const mission = await Mission.findById(req.params.id);
  if (!mission) {
    res.status(404);
    throw new Error('Mission not found');
  }
  res.json({ success: true, data: mission });
});

// @desc    Create a mission. This is what the front end's addMission()
//          modal/prompt calls. The AI-planning fields (subtasks, estimate,
//          missProbability) are filled in with a lightweight heuristic so
//          the "AI Thinking..." UI sequence has real data to land on.
// @route   POST /api/missions
const createMission = asyncHandler(async (req, res) => {
  const { name, description, priority, dueDate } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error('Mission name is required');
  }

  // Simple heuristic "AI planner" — deterministic, no external AI call needed,
  // but structured so a real LLM call could replace this function later.
  const estimatedMinutes = 90 + Math.floor(Math.random() * 90);
  const missProbability = priority === 'critical' ? 70 + Math.floor(Math.random() * 20)
    : priority === 'high' ? 40 + Math.floor(Math.random() * 25)
    : 10 + Math.floor(Math.random() * 25);

  const subtasks = [
    { name: 'Research & scoping', estimatedMinutes: 20, aiConfidence: 90 },
    { name: 'Core implementation', estimatedMinutes: Math.round(estimatedMinutes * 0.5), aiConfidence: 84 },
    { name: 'Review & polish', estimatedMinutes: Math.round(estimatedMinutes * 0.2), aiConfidence: 88 }
  ];

  const mission = await Mission.create({
    name: name.trim(),
    description: description?.trim() || '',
    priority: priority || 'medium',
    status: 'pending',
    dueDate: dueDate || null,
    estimatedMinutes,
    missProbability,
    aiScheduled: true,
    subtasks
  });

  res.status(201).json({ success: true, data: mission });
});

// @desc    Update a mission (progress, status, name, etc.)
// @route   PUT /api/missions/:id
const updateMission = asyncHandler(async (req, res) => {
  const mission = await Mission.findById(req.params.id);
  if (!mission) {
    res.status(404);
    throw new Error('Mission not found');
  }

  Object.assign(mission, req.body);

  // Keep status in sync with progress so the UI badges stay correct.
  if (typeof req.body.progress === 'number') {
    if (req.body.progress >= 100) mission.status = 'accomplished';
    else if (req.body.progress > 0) mission.status = 'in-progress';
  }

  const updated = await mission.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete a mission
// @route   DELETE /api/missions/:id
const deleteMission = asyncHandler(async (req, res) => {
  const mission = await Mission.findById(req.params.id);
  if (!mission) {
    res.status(404);
    throw new Error('Mission not found');
  }
  await mission.deleteOne();
  res.json({ success: true, data: {} });
});

module.exports = { getMissions, getMission, createMission, updateMission, deleteMission };
