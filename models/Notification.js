const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // User, parent or guardian
  type: { type: String, required: true }, // Type of notification (e.g., 'achievement', 'milestone', 'profileUpdate')
  message: { type: String, required: true }, // The content of the notification
  status: { type: String, default: 'pending' }, // Status: 'pending', 'sent'
  createdAt: { type: Date, default: Date.now },
  sentAt: { type: Date, default: null }, // Date when the notification is actually sent
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
