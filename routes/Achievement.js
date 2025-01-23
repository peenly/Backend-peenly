const express = require('express');
const ChildProfile = require('../models/Child.model');
const router = express.Router();


// Add achievement
router.post('/add', async (req, res) => {
    const { childId, achievement } = req.body;

    try {
        const child = await ChildProfile.findById(childId);

        if (!child) {
            return res.status(404).json({ message: 'Child profile not found' });
        }

        child.achievements.push(achievement);
        await child.save();

        res.status(201).json({ message: 'Achievement added successfully', child });
    } catch (error) {
        res.status(500).json({ message: 'Error adding achievement', error });
    }
});

router.delete('/delete', async (req, res)=>{
    const { childId, achievement} = req.body;

    try{
        const child = await ChildProfile.findByIdAndDelete(childId)
        if (!child){
            return res.status(404).json({Message: 'Unable to Delete'});
        }

        child.achievements.push(achievement);
        await child.save();

        res.status(200),json({message: 'ChildProfile Deleted Successfully'});
        
    }catch(error){
        res.status(500).json({message:'Error Deleting Child Achievement'});
    }

});

router.put('/update', async (req, res)=>{
    try{
        const { childId, achievement} = req.body;
        const child = await ChildProfile.findByIdAndUpdate(childId)
        if (!child){
            return res.status(404).json({message: 'achievement not found'})
        }

        child.achievements.push(achievement);
        await child.save();

        const updatedChild = await child.findById(ChildId)
        res.status(200).json(updatedChild)
    }catch(error){
        res.status(500).json({message: 'error updating child'})
    }
});

module.exports = router;

