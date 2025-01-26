const Achievement = require('../models/Achievement');
const Milestone = require('../models/Milestone');
const ChildProfile = require('../models/Child.model');  // Assuming you have this model
const User = require('../models/User.Model');

const getDashboardData = async (req, res) => {
  try {
    const { childId } = req.params;

    // Fetch child profile to ensure valid child
    const childProfile = await ChildProfile.findById(childId);
    if (!childProfile) {
      return res.status(404).json({ message: 'Child profile not found' });
    }

    // Fetch achievements for the child
    const achievements = await Achievement.find({ childId }).sort({ date: -1 }).limit(5);  // Latest 5 achievements

    // Fetch milestones for the child
    const milestones = await Milestone.find({ childId }).sort({ date: -1 }).limit(5);  // Latest 5 milestones

    

    //  total achievements, milestones
    const totalAchievements = await Achievement.countDocuments({ childId });
    const totalMilestones = await Milestone.countDocuments({ childId });

    // Prepare dashboard data
    const dashboardData = {
      childProfile,
      achievements,
      milestones,
      totalAchievements,
      totalMilestones,
    };

    res.status(200).json({
      message: 'Dashboard data retrieved successfully',
      data: dashboardData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};

module.exports = {
  getDashboardData,
};
