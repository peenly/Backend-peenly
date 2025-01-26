const express = require('express');
const { scheduleNotification, getNotifications } = require('../controllers/NotificationController');
const router = express.Router();

/**
 * @swagger
 * /api/notification/send-notifications:
 *   post:
 *     summary: Schedule a new notification for a user.
 *     tags:
 *       - Notification
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "63c9e5b5f5a48e1c4e7e3d89"
 *               message:
 *                 type: string
 *                 example: "Reminder: Your homework is due tomorrow."
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-02-01T10:00:00Z"
 *               type:
 *                 type: string
 *                 enum: [reminder, alert, notification]
 *                 example: "reminder"
 *     responses:
 *       201:
 *         description: Notification scheduled successfully.
 *       400:
 *         description: Missing or invalid data in the request.
 *       500:
 *         description: Internal server error.
 */
router.post('/send-notifications', scheduleNotification);

/**
 * @swagger
 * /api/notification/get-notifications/{userId}:
 *   get:
 *     summary: Fetch all notifications for a user.
 *     tags:
 *       - Notification
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "63c9e5b5f5a48e1c4e7e3d89"
 *     responses:
 *       200:
 *         description: List of notifications for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Reminder: Your homework is due tomorrow."
 *                   dateTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-01T10:00:00Z"
 *                   type:
 *                     type: string
 *                     example: "reminder"
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/get-notifications/:userId', getNotifications);

module.exports = router;
