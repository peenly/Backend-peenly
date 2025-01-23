const express = require('express');
const ChildProfile = require('../models/User.Model');
const User = require('../models/Child.model');
const router = express.Router();

// Invite a guardian
router.post('/invite-guardian', async (req, res) => {
    const { childId, guardianEmail } = req.body;

    try {
        const child = await ChildProfile.findById(childId);
        const guardian = await User.findOne({ email: guardianEmail });

        if (!child || !guardian) {
            return res.status(404).json({ message: 'Child or Guardian not found' });
        }

        child.guardians.push(guardian._id);
        await child.save();

        res.status(200).json({ message: 'Guardian added successfully', child });
    } catch (error) {
        res.status(500).json({ message: 'Error adding guardian', error });
    }

    });
    router.delete('/delete-guardian', async (req, res) => {
        const { childId, guardianEmail } = req.body;
    
        try {
            const child = await ChildProfile.findById(childId);
            const guardian = await User.findOne({ email: guardianEmail });
    
            if (!child || !guardian) {
                return res.status(404).json({ message: 'Child or Guardian not found' });
            }
    
            child.guardians.push(guardian._id);
            await child.save();
    
            res.status(200).json({ message: 'Guardian Deleted successfully', child });
        } catch (error) {
            res.status(500).json({ message: 'Error Deleting guardian', error });
        }
    });



module.exports = router;
