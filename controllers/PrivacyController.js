const PrivacySettings = require('../models/Privacy');
const ChildProfile = require('../models/Child.model'); 
const mongoose = require('mongoose')


// Get privacy settings for a child profile
const getPrivacySettings = async (req, res) => {
  try {
    const { childId } = req.params;

    // Validate that the child ID is valid
    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({ message: 'Invalid child ID format' });
    }

    // Find the child's privacy settings
    const privacySettings = await PrivacySettings.findOne({ childId });

    if (!privacySettings) {
      return res.status(404).json({ message: 'Privacy settings not found for this child' });
    }

    res.status(200).json({
      message: 'Privacy settings fetched successfully',
      privacySettings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching privacy settings', error: error.message });
  }
};

// Update privacy settings for a child profile
const updatePrivacySettings = async (req, res) => {
  try {
    const { childId } = req.params;
    const { canViewAchievements, canViewMilestone, canViewHobbies } = req.body;

    // Validate that the child ID is valid
    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({ message: 'Invalid child ID format' });
    }

    // Find the privacy settings for this child
    let privacySettings = await PrivacySettings.findOne({ childId });

    if (!privacySettings) {
      // If no privacy settings exist, create them
      privacySettings = new PrivacySettings({
        childId,
        canViewAchievements,
        canViewMilestone,
        canViewHobbies,
      });
      await privacySettings.save();
    } else {
      // If privacy settings exist, update them
      privacySettings.canViewAchievements = canViewAchievements;
      privacySettings.canViewMilestone = canViewMilestone;
      privacySettings.canViewHobbies = canViewHobbies;
      await privacySettings.save();
    }

    res.status(200).json({
      message: 'Privacy settings updated successfully',
      privacySettings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating privacy settings', error: error.message });
  }
};

module.exports = {
  getPrivacySettings,
  updatePrivacySettings,
};
