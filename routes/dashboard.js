const express = require('express');
const router = express.Router();


router.get('/dashboard', async (req, res) => {
    try {
      const { childId } = req.query;
  
      if (!childId) {
        return res.status(400).json({ message: 'Child ID is required' });
      }
  
      const achievements = await Achievement.find({ childId });
      const milestones = await Milestone.find({ childId });
  
      const dashboard = {
        achievements,
        milestones,
        totalAchievements: achievements.length,
        totalMilestones: milestones.length,
      };
  
      res.status(200).json(dashboard);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching dashboard data', error });
    }
  });

  module.exports = router