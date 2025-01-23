const express = require('express');
const ChildProfile = require('../models/Child.model');
const router = express.Router();

// Update privacy settings
router.put('/privacy', async (req, res) => {
    const { childId, privacy } = req.body;

    try {
        const child = await ChildProfile.findById(childId);

        if (!child) {
            return res.status(404).json({ message: 'Child profile not found' });
        }

        child.privacy = privacy;
        await child.save();

        res.status(200).json({ message: 'Privacy settings updated successfully', child });
    } catch (error) {
        res.status(500).json({ message: 'Error updating privacy settings', error });
    }
});


router.get('/privacy-childId', async (req, res) => {
    try {
      const { childId } = req.params;
      const child = await ChildProfile.findById(childId);
  
      if (!child) {
        return res.status(404).json({ message: 'Child not found' });
      }

      child.privacy = privacy;
      await child.save();

  
      res.status(200).json(child.privacySettings);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching privacy settings', error });
    }
  });

module.exports = router;
