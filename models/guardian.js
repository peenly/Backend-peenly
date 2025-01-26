const mongoose = require('mongoose');

const guardianSchema = new mongoose.Schema({
  guardianId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },  //  User model for guardian
  childId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ChildProfile' },  // Child profile model
  relationship: String,

});

module.exports = mongoose.model('Guardian', guardianSchema);