const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboard');

/**
 * @swagger
 * /api/dashboard/get-dashboard/{childId}:
 *   get:
 *     summary: Retrieve the dashboard data for a specific child.
 *     tags:
 *       - Dashboard
 *     parameters:
 *       - name: childId
 *         in: path
 *         required: true
 *         description: The ID of the child to retrieve dashboard data for.
 *         type: string
 *         example: "63c9e5b5f5a48e1c4e7e3d89"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dashboard data retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     childProfile:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "63c9e5b5f5a48e1c4e7e3d89"
 *                         firstName:
 *                           type: string
 *                           example: "John"
 *                         lastName:
 *                           type: string
 *                           example: "Doe"
 *                         age:
 *                           type: integer
 *                           example: 8
 *                     achievements:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "63c9e5b5f5a48e1c4e7e3d88"
 *                           achievementName:
 *                             type: string
 *                             example: "Won a gold medal"
 *                           date:
 *                             type: string
 *                             format: date
 *                             example: "2024-01-25"
 *                     milestones:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "63c9e5b5f5a48e1c4e7e3d87"
 *                           milestoneName:
 *                             type: string
 *                             example: "Reached reading level 2"
 *                           date:
 *                             type: string
 *                             format: date
 *                             example: "2024-01-20"
 *                     totalAchievements:
 *                       type: integer
 *                       example: 10
 *                     totalMilestones:
 *                       type: integer
 *                       example: 5
 *       404:
 *         description: Child profile not found.
 *       500:
 *         description: Error fetching dashboard data.
 */

// Define route to get dashboard data
router.get('/get-dashboard/:childId', getDashboardData);

module.exports = router;
