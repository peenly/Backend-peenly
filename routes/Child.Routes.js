const express = require('express');
const router = express.Router();
const { ChildAuth } = require('../controllers/Child.Auth');

/**
 * @swagger
 * /api/child:
 *   post:
 *     summary: Create a child profile.
 *     tags:
 *       - Child
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               age:
 *                 type: integer
 *                 example: 8
 *               privacy:
 *                 type: string
 *                 enum: [public, private]
 *                 example: private
 *     responses:
 *       201:
 *         description: Child profile created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Child profile created successfully
 *                 childProfile:
 *                   type: object
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal server error.
 */
router.post('/api/child', ChildAuth);

/**
 * @swagger
 * /update:
 *   put:
 *     summary: Update a child profile.
 *     tags:
 *       - Child
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               childId:
 *                 type: string
 *                 example: 63c9e5b5f5a48e1c4e7e3d89
 *               name:
 *                 type: string
 *                 example: John Doe Updated
 *               age:
 *                 type: integer
 *                 example: 9
 *     responses:
 *       200:
 *         description: Child profile updated successfully.
 *       404:
 *         description: Child profile not found.
 *       500:
 *         description: Error updating child profile.
 */
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

/**
 * @swagger
 * /delete:
 *   delete:
 *     summary: Delete a child profile.
 *     tags:
 *       - Child
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               childId:
 *                 type: string
 *                 example: 63c9e5b5f5a48e1c4e7e3d89
 *     responses:
 *       200:
 *         description: Child profile deleted successfully.
 *       404:
 *         description: Child profile not found.
 *       500:
 *         description: Error deleting child profile.
 */
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

module.exports = router;
