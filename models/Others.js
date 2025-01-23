const mongoose = require('mongoose')

const AchievementSchema = new mongoose.Schema({
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChildProfile', required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    category: { type: String },
    mediaUrl: { type: String },
  });
  
  const MilestoneSchema = new mongoose.Schema({
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChildProfile', required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    reminder: { type: Date },
  });
  
  const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
  });
  
  
  const Achievement = mongoose.model('Achievement', AchievementSchema);
  const Milestone = mongoose.model('Milestone', MilestoneSchema);
  const Notification = mongoose.model('Notification', NotificationSchema);