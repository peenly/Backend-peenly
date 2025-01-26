const Guardian = require('../models/guardian');  // Guardian model
const ChildProfile = require('../models/Child.model');  // Child profile model

// Link a guardian to a child profile
const linkGuardian = async (req, res) => {
  try {
    const { guardianId, childId , relationship} = req.body;

    // Ensure both guardianId and childId are provided
    if (!guardianId || !childId) {
      return res.status(400).json({ message: 'Guardian ID and Child ID are required' });
    }

    // Find the child profile
    const childProfile = await ChildProfile.findById(childId);
    if (!childProfile) {
      return res.status(404).json({ message: 'Child profile not found' });
    }

    // Check if the guardian is already linked to the child
    const existingLink = await Guardian.findOne({ guardianId, childId });
    if (existingLink) {
      return res.status(400).json({ message: 'Guardian is already linked to this child' });
    }

    // Create the link between guardian and child
    const guardianLink = new Guardian({ guardianId, childId });
    await guardianLink.save();

    res.status(201).json({
      message: 'Guardian linked to child profile successfully!',
      guardianLink,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error linking guardian to child profile', error: error.message });
  }
};

// Unlink a guardian from a child profile
const unlinkGuardian = async (req, res) => {
  try {
    const { guardianId, childId } = req.body;

    // Ensure both guardianId and childId are provided
    if (!guardianId || !childId) {
      return res.status(400).json({ message: 'Guardian ID and Child ID are required' });
    }

    // Find the link between the guardian and child
    const guardianLink = await Guardian.findOneAndDelete({ guardianId, childId });
    if (!guardianLink) {
      return res.status(404).json({ message: 'Guardian link not found' });
    }

    res.status(200).json({ message: 'Guardian unlinked from child profile successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error unlinking guardian from child profile', error: error.message });
  }
};





module.exports = {
  linkGuardian,
  unlinkGuardian,
  
};
