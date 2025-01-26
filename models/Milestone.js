const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChildProfile', // Reference to the Child model
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  reminder: {
    enabled: { type: Boolean, default: false },
    time: { type: Date },
  },
});

module.exports = mongoose.model('Milestone', MilestoneSchema);
