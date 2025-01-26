const express = require('express');
const router = express.Router();
const { linkGuardian, unlinkGuardian } = require('../controllers/guardian');
const { authenticate } = require('../Middleware/Auth'); 
const User = require('../models/User.Model');
const Guardian = require('../models/guardian');  
const Child = require('../models/Child.model');

/**
 * @swagger
 * /api/guardian/link:
 *   post:
 *     summary: Link a guardian to a child's profile.
 *     tags:
 *       - Guardian
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guardianId:
 *                 type: string
 *                 example: 63c9e5b5f5a48e1c4e7e3d89
 *               childId:
 *                 type: string
 *                 example: 63c9e5b5f5a48e1c4e7e3d90
 *               relationship:
 *                 type: string
 *                 example: Father
 *     responses:
 *       201:
 *         description: Guardian linked to the child successfully.
 *       400:
 *         description: Missing required fields.
 *       404:
 *         description: Guardian or child not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/link', async (req, res) => {
    const { guardianId, childId, relationship } = req.body;

    try {
        // Find the guardian and child
        const guardian = await User.findById(guardianId);
        if (!guardian) {
            return res.status(404).json({ message: 'Guardian not found.' });
        }

        const child = await Child.findById(childId);
        if (!child) {
            return res.status(404).json({ message: 'Child not found.' });
        }

        // Link the guardian to the child's profile
        child.guardian = guardianId;  // Assuming child has a guardian field
        await child.save();

        // Add the child to the guardian's children array
        guardian.children.push(childId);
        await guardian.save();

        res.status(201).json({
            message: 'Guardian linked successfully.',
            child: child,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error linking guardian.',
            error: error.message,
        });
    }
});

/**
 * @swagger
 * /api/guardian/unlink:
 *   delete:
 *     summary: Unlink a guardian from a child's profile.
 *     tags:
 *       - Guardian
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guardianId:
 *                 type: string
 *                 example: 63c9e5b5f5a48e1c4e7e3d89
 *               childId:
 *                 type: string
 *                 example: 63c9e5b5f5a48e1c4e7e3d90
 *     responses:
 *       200:
 *         description: Guardian unlinked successfully.
 *       404:
 *         description: Guardian or child not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/unlink', async (req, res) => {
    const { guardianId, childId } = req.body;

    try {
        // Find the guardian and child
        const guardian = await User.findById(guardianId);
        if (!guardian) {
            return res.status(404).json({ message: 'Guardian not found.' });
        }

        const child = await Child.findById(childId);
        if (!child) {
            return res.status(404).json({ message: 'Child not found.' });
        }

        // Unlink the guardian from the child's profile
        child.guardian = null;  // Remove the guardian reference
        await child.save();

        // Remove the child from the guardian's children array
        guardian.children = guardian.children.filter(childIdInGuardian => childIdInGuardian.toString() !== childId);
        await guardian.save();

        res.status(200).json({
            message: 'Guardian unlinked successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error unlinking guardian.',
            error: error.message,
        });
    }
});

module.exports = router;
