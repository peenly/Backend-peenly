const Achievement = require('../models/Achievement'); // Achievement model
const User = require('../models/User.Model'); // Assuming User model exists for reference

// Add an achievement
const addAchievement = async (req, res) => {
  try {
    const { title, description, category, parentId, childId } = req.body;

    // Assume `req.user` is populated by authentication middleware
    const achievement = new Achievement({
      title,
      description,
      category,
      parentId: req.user.id, // Use authenticated user's ID as the parent
      childId,
    });

    await achievement.save();

    await User.findByIdAndUpdate(req.user.id, { $push: { achievements: achievement._id } });

    res.status(201).json({ message: 'Achievement added successfully', achievement });
  } catch (error) {
    res.status(500).json({ message: 'Error adding achievement', error: error.message });
  }
};

// Update an achievement
const updateAchievement = async (req, res) => {
  try {
    const { achievementId } = req.params;
    const { title, description, category } = req.body;

    const achievement = await Achievement.findByIdAndUpdate(
      achievementId,
      { title, description, category },
      { new: true }
    );

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    res.status(200).json({ message: 'Achievement updated successfully', achievement });
  } catch (error) {
    res.status(500).json({ message: 'Error updating achievement', error: error.message });
  }
};



// Get all achievements (for a specific parent or child)
const getAchievements = async (req, res) => {
  try {
    const { childId } = req.params;  // Retrieve childId from the URL parameters

    // Validate that the childId is present
    if (!childId) {
      return res.status(400).json({ message: 'Child ID is required' });
    }

    // Query achievements based on childId
    const achievements = await Achievement.find({ childId });

    if (!achievements || achievements.length === 0) {
      return res.status(404).json({ message: 'No achievements found for this child' });
    }

    res.status(200).json({
      message: 'Achievements fetched successfully.',
      achievements,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching achievements.', error: error.message });
  }
};

module.exports = {
  addAchievement,
  updateAchievement,
  getAchievements,
};
