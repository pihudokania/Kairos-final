const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    estimatedMinutes: { type: Number, default: 30, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'active', 'done'],
      default: 'pending'
    },
    aiConfidence: { type: Number, min: 0, max: 100, default: 85 }
  },
  { _id: false }
);

const missionSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Mission name is required'], trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['planning', 'pending', 'in-progress', 'accomplished'],
      default: 'planning'
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    dueDate: { type: Date },
    estimatedMinutes: { type: Number, default: 150, min: 0 },
    missProbability: { type: Number, min: 0, max: 100, default: 20 },
    aiScheduled: { type: Boolean, default: false },
    subtasks: { type: [subtaskSchema], default: [] },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mission', missionSchema);
