const express = require('express');
const router = express.Router();
const { getPrivacySettings, updatePrivacySettings } = require('../controllers/PrivacyController');

/**
 * @swagger
 * /api/privacy/privacy-settings/{childId}:
 *   get:
 *     summary: Fetch the privacy settings for a child's profile.
 *     tags:
 *       - Privacy
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: childId
 *         in: path
 *         required: true
 *         description: The ID of the child whose privacy settings are to be fetched.
 *         schema:
 *           type: string
 *           example: "63c9e5b5f5a48e1c4e7e3d89"
 *     responses:
 *       200:
 *         description: Privacy settings for the child profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 childId:
 *                   type: string
 *                   example: "63c9e5b5f5a48e1c4e7e3d89"
 *                 canViewAchievements:
 *                   type: boolean
 *                   example: true
 *                 canViewMilestone:
 *                   type: boolean
 *                   example: true
 *                 canViewHobbies:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Child profile not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/privacy-settings/:childId', getPrivacySettings);

/**
 * @swagger
 * /api/privacy/privacy-settings/{childId}:
 *   put:
 *     summary: Update the privacy settings for a child's profile.
 *     tags:
 *       - Privacy
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: childId
 *         in: path
 *         required: true
 *         description: The ID of the child whose privacy settings are to be updated.
 *         schema:
 *           type: string
 *           example: "63c9e5b5f5a48e1c4e7e3d89"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               canViewAchievements:
 *                 type: boolean
 *                 example: true
 *               canViewMilestone:
 *                 type: boolean
 *                 example: true
 *               canViewHobbies:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Privacy settings updated successfully.
 *       400:
 *         description: Invalid data or missing required fields.
 *       404:
 *         description: Child profile not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/privacy-settings/:childId', updatePrivacySettings);

module.exports = router;
