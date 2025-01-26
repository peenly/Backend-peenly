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
 *               title:
 *                 type: string
 *                 example: "Complete Homework"
 *               description:
 *                 type: string
 *                 example: "Finish all math homework by end of the week."
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-02-01T12:00:00Z"
 *               reminder:
 *                 type: boolean
 *                 example: true
 *               childId:
 *                 type: string
 *                 example: "63c9e5b5f5a48e1c4e7e3d89"
 *     responses:
 *       201:
 *         description: Milestone added successfully.
 *       400:
 *         description: Missing or invalid data in the request.
 *       500:
 *         description: Internal server error.
 */
router.post('/add', addMilestone);

/**
 * @swagger
 * /api/milestone/retrieve:
 *   get:
 *     summary: Retrieve all milestones.
 *     tags:
 *       - Milestone
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all milestones.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "Complete Homework"
 *                   description:
 *                     type: string
 *                     example: "Finish all math homework by end of the week."
 *                   dueDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-01T12:00:00Z"
 *                   reminder:
 *                     type: boolean
 *                     example: true
 *                   childId:
 *                     type: string
 *                     example: "63c9e5b5f5a48e1c4e7e3d89"
 *       500:
 *         description: Internal server error.
 */
router.get('/retrieve', getMilestones);

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
