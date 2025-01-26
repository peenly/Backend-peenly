// Create child profile
const ChildProfile = require('../models/Child.model');
const User = require('../models/User.Model')

// Add a child
const addChild  = async (req, res) => {
  try {
    const { name, dateOfBirth, hobbies } = req.body;
    const parentId = req.user.id; // Assume `req.user` is populated by authentication middleware

    const child = new ChildProfile({ name, dateOfBirth, hobbies, parent: parentId });
    await child.save();

    // Update parent's child list
    await User.findByIdAndUpdate(parentId, { $push: { children: child._id } });

    res.status(201).json({ message: 'Child added successfully', child });
  } catch (error) {
    res.status(500).json({ message: 'Error adding child', error: error.message });
  }
};


const updateChild = async (req, res) => {
  try {
    const { childId } = req.params;
    const { name, dateOfBirth, hobbies } = req.body;

    const child = await ChildProfile.findByIdAndUpdate(
      childId,
      { name, dateOfBirth, hobbies },
      { new: true }
    );

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    res.status(200).json({ message: 'Child updated successfully', child });
  } catch (error) {
    res.status(500).json({ message: 'Error updating child', error: error.message });
  }
};


const deleteChild = async (req, res) => {
  try {
    const { childId } = req.params;

    const child = await ChildProfile.findByIdAndDelete(childId);

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    // Remove the child from the parent's list
    await User.findByIdAndUpdate(child.parent, { $pull: { children: childId } });

    res.status(200).json({ message: 'Child deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting child', error: error.message });
  }
};

const getChildren = async (req, res) => {
  try {
    const parentId = req.user.id;

    const children = await ChildProfile.find({ parent: parentId });

    res.status(200).json({ children });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching children', error: error.message });
  }
};

  module.exports = {
    getChildren,
    deleteChild,
    updateChild,
    addChild
    };
