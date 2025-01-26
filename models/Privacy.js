const mongoose = require('mongoose');

const privacySettingsSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ChildProfile' },
  canViewAchievements: { type: Boolean, default: true },  // Default to true (can be viewed)
  canViewMilestone: { type: Boolean, default: true },      // Default to true (can be viewed)
  canViewHobbies: { type: Boolean, default: true },       // Default to true (can be viewed)
});

module.exports = mongoose.model('PrivacySettings', privacySettingsSchema);
