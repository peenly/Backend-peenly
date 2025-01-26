const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  category: { type: String, enum: ['Academic', 'Sports', 'Arts', 'Miscellaneous'], required: true },
  media: { type: String, required: false }, 
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to parent profile
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChildProfile', required: true }, // Reference to child profile
}, { timestamps: true });

const Achievement = mongoose.model('Achievement', AchievementSchema);
module.exports = Achievement;
