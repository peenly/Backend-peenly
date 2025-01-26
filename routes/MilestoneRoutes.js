const express = require('express');
const router = express.Router();
const { addMilestone, getMilestones, deleteMilestone } = require('../controllers/Milestone');

/**
 * @swagger
 * /api/milestone/add:
 *   post:
 *     summary: Add a milestone with a reminder.
 *     tags:
 *       - Milestone
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               childId:
 *                 type: string
 *                 example: "6795691729abc283e5598348"
 *               title:
 *                 type: string
 *                 example: "My Reading time"
 *               description:
 *                 type: string
 *                 example: "My afternoon reading day"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-02-30"  
 *               reminder:
 *                 type: object
 *                 properties:
 *                   enabled:
 *                     type: boolean
 *                     example: true
 *     responses:
 *       201:
 *         description: Milestone added successfully.
 *       400:
 *         description: Missing or invalid data in the request (e.g., invalid date).
 *       500:
 *         description: Internal server error.
 */


router.post('/add', addMilestone);

/**
 * @swagger
 * /api/milestone/retrieve:
 *   post:
 *     summary: Retrieve all milestones for a specific child.
 *     tags:
 *       - Milestone
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               childId:
 *                 type: string
 *                 example: "6795691729abc283e5598348"
 *     responses:
 *       200:
 *         description: List of all milestones for the child.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "My Reading time"
 *                   description:
 *                     type: string
 *                     example: "My afternoon reading day"
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-30"  
 *                   reminder:
 *                     type: object
 *                     properties:
 *                       enabled:
 *                         type: boolean
 *                         example: true
 *                   childId:
 *                     type: string
 *                     example: "6795691729abc283e5598348"
 *       400:
 *         description: Missing or invalid data (e.g., childId).
 *       500:
 *         description: Internal server error.
 */

router.get('/retrieve/:childId', getMilestones);

/**
 * @swagger
 * /api/milestone/delete/{milestoneId}:
 *   delete:
 *     summary: Remove a milestone by ID.
 *     tags:
 *       - Milestone
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: milestoneId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "63c9e5b5f5a48e1c4e7e3d89"
 *     responses:
 *       200:
 *         description: Milestone deleted successfully.
 *       404:
 *         description: Milestone not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/delete/:milestoneId', deleteMilestone);

module.exports = router;
