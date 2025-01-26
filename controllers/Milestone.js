const Milestone = require('../models/Milestone'); // Milestone model
const ChildProfile =require('../models/Child.model')

// Add a milestone and set reminders
const addMilestone = async (req, res) => {
    try {
      const { childId, title, description, date, reminder } = req.body;
  
      // Validate child existence
      const child = await ChildProfile.findById(childId);
      if (!child) {
        return res.status(404).json({ message: 'Child not found' });
      }
  
      // Calculate reminder time if enabled
      let calculatedReminder = {};
      if (reminder?.enabled) {
        const milestoneDate = new Date(date);
        calculatedReminder = {
          enabled: true,
          time: new Date(milestoneDate.getTime() - 24 * 60 * 60 * 1000),
        };
      }
  
      // Create milestone
      const milestone = new Milestone({
        childId,
        title,
        description,
        date,
        reminder: calculatedReminder,
      });
  
     
  
      const savedMilestone = await milestone.save();
  
      res.status(201).json({
        message: 'Milestone added successfully!',
        milestone: savedMilestone,
      });
    } catch (error) {
     
      res.status(500).json({ error: error.message || 'An error occurred while adding the milestone' });
    }
  };
  
  
const getMilestones = async (req, res) => {
    try {
      const { childId } = req.body;  
      
      // Ensure childId is provided
      if (!childId) {
        return res.status(400).json({ message: 'Child ID is required' });
      }
  
      // Find milestones based on childId
      const milestones = await Milestone.find({ childId });
      res.status(200).json({ milestones });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching milestones', error: error.message });
    }
  };
  
  

// Remove a milestone
const deleteMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const milestone = await Milestone.findByIdAndDelete(milestoneId);

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    res.status(200).json({ message: 'Milestone removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing milestone', error: error.message });
  }
};

module.exports = {
  addMilestone,
  getMilestones,
  deleteMilestone,
};
