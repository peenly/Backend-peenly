// Create child profile
const child = require('../models/Child.model');

const ChildAuth = async (req, res) => {
    try {
      const { name, age, privacy } = req.body;
  
      if (!name || !age || !privacy) {
        return res.status(400).json({ message: 'Send all required fields: name, age, privacy' });
      }
  
      const childProfile = new child({
        name,
        age,
        privacy,
        guardianId: req.user?.id,
      });
  
      await User.findByIdAndUpdate(req.user.id, { $push: { children: childProfile._id } });
      res.status(201).json({ message: 'Child profile created successfully', childProfile });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }

  }

  module.exports = {
    ChildAuth
  };