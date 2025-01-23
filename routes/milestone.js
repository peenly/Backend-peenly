const express = require('express');
const ChildProfile = require('../models/Child.model');
const router = express.Router();

// Add achievement
router.post('/add-milestone', async (req, res) => {
    const { childId, milestone } = req.body;

    try {
        const child = await ChildProfile.findById(childId);

        if (!child) {
            return res.status(404).json({ message: 'Child profile not found' });
        }

        child.milestones.push(milestone);
        await child.save();

        res.status(201).json({ message: 'Milestone added successfully', child });
    } catch (error) {
        res.status(500).json({ message: 'Error adding Milestone', error });
    }
});


module.exports = router;
