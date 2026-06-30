const mongoose = require('mongoose');

const reflectionSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    body: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reflection', reflectionSchema);
