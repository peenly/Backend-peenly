const express = require('express')
const router = express.Router()


const { ChildAuth } = require('../controllers/Child.Auth')



router.post('/api/child', ChildAuth)

router.put('/update', async (req, res) => {
    const { childId, name, age } = req.body;

    try {
        const child = await ChildProfile.findByIdAndUpdate(childId, { name, age }, { new: true });

        if (!child) {
            return res.status(404).json({ message: 'Child profile not found' });
        }

        res.status(200).json({ message: 'Child profile updated successfully', child });
    } catch (error) {
        res.status(500).json({ message: 'Error updating child profile', error });
    }
});

router.delete('/delete', async (req, res) => {
    const { childId } = req.body;

    try {
        const child = await ChildProfile.findByIdAndDelete(childId);

        if (!child) {
            return res.status(404).json({ message: 'Child profile not found' });
        }

        res.status(200).json({ message: 'Child profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting child profile', error });
    }
});



module.exports = router