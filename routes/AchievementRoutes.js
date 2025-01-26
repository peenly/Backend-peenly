const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const upload = require('../Middleware/multer'); 
const { getAchievements } = require('../controllers/Achievement');


/**
 * @swagger
 * components:
 *   schemas:
 *     Achievement:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - category
 *         - parentId
 *         - childId
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the achievement.
 *         description:
 *           type: string
 *           description: A description of the achievement.
 *         date:
 *           type: string
 *           format: date
 *           description: The date when the achievement was earned.
 *         category:
 *           type: string
 *           enum: [Academic, Sports, Arts, Miscellaneous]
 *           description: Category of the achievement.
 *         media:
 *           type: string
 *           description: Link to media associated with the achievement (optional).
 *         parentId:
 *           type: string
 *           description: The ID of the parent (User).
 *         childId:
 *           type: string
 *           description: The ID of the child (ChildProfile).
 *       example:
 *         title: "Math Olympiad Winner"
 *         description: "Won first place in the regional Math Olympiad."
 *         date: "2023-05-10"
 *         category: "Academic"
 *         media: "https://example.com/media/achievement.jpg"
 *         parentId: "63c9e5b5f5a48e1c4e7e3d89"
 *         childId: "63c9e5b5f5a48e1c4e7e3d90"
 *
 *     Child:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - age
 *         - parent
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         age:
 *           type: integer
 *         hobbies:
 *           type: array
 *           items:
 *             type: string
 *         parent:
 *           type: string
 *           description: The ID of the parent (User).
 *       example:
 *         firstName: "John"
 *         lastName: "Doe"
 *         age: 10
 *         hobbies: ["Soccer", "Reading"]
 *         parent: "63c9e5b5f5a48e1c4e7e3d89"
 *
 *     Guardian:
 *       type: object
 *       required:
 *         - guardianId
 *         - childId
 *       properties:
 *         guardianId:
 *           type: string
 *           description: The ID of the guardian (User).
 *         childId:
 *           type: string
 *           description: The ID of the child (ChildProfile).
 *         relationship:
 *           type: string
 *           description: The relationship between the guardian and the child (e.g., "father", "mother").
 *       example:
 *         guardianId: "63c9e5b5f5a48e1c4e7e3d89"
 *         childId: "63c9e5b5f5a48e1c4e7e3d90"
 *         relationship: "Father"
 *
 *     Milestone:
 *       type: object
 *       required:
 *         - childId
 *         - title
 *         - date
 *       properties:
 *         childId:
 *           type: string
 *           description: The ID of the child (ChildProfile).
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         reminder:
 *           type: object
 *           properties:
 *             enabled:
 *               type: boolean
 *             time:
 *               type: string
 *               format: date
 *       example:
 *         childId: "63c9e5b5f5a48e1c4e7e3d90"
 *         title: "First Day at School"
 *         description: "Celebrating the child's first day of school."
 *         date: "2023-09-01"
 *         reminder:
 *           enabled: true
 *           time: "2023-08-31T10:00:00Z"
 *
 *     Notification:
 *       type: object
 *       required:
 *         - recipientId
 *         - type
 *         - message
 *       properties:
 *         recipientId:
 *           type: string
 *           description: The ID of the user (parent or guardian).
 *         type:
 *           type: string
 *           description: Type of notification (e.g., "achievement", "milestone").
 *         message:
 *           type: string
 *           description: The content of the notification.
 *         status:
 *           type: string
 *           description: The status of the notification (e.g., "pending", "sent").
 *         createdAt:
 *           type: string
 *           format: date
 *           description: When the notification was created.
 *         sentAt:
 *           type: string
 *           format: date
 *           description: When the notification was sent.
 *       example:
 *         recipientId: "63c9e5b5f5a48e1c4e7e3d89"
 *         type: "achievement"
 *         message: "Congratulations, your child has won the Math Olympiad!"
 *         status: "pending"
 *         createdAt: "2023-05-10T14:30:00Z"
 *         sentAt: null
 *
 *     Otp:
 *       type: object
 *       required:
 *         - email
 *         - otpCode
 *         - expiresAt
 *       properties:
 *         email:
 *           type: string
 *         otpCode:
 *           type: string
 *         expiresAt:
 *           type: string
 *           format: date
 *       example:
 *         email: "user@example.com"
 *         otpCode: "123456"
 *         expiresAt: "2023-05-10T14:35:00Z"
 *
 *     PrivacySettings:
 *       type: object
 *       required:
 *         - childId
 *       properties:
 *         childId:
 *           type: string
 *         canViewAchievements:
 *           type: boolean
 *         canViewMilestone:
 *           type: boolean
 *         canViewHobbies:
 *           type: boolean
 *       example:
 *         childId: "63c9e5b5f5a48e1c4e7e3d90"
 *         canViewAchievements: true
 *         canViewMilestone: true
 *         canViewHobbies: false
 *
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         mfaEnabled:
 *           type: boolean
 *         children:
 *           type: array
 *           items:
 *             type: string
 *         guardians:
 *           type: array
 *           items:
 *             type: string
 *       example:
 *         email: "user@example.com"
 *         password: "securepassword123"
 *         first_name: "John"
 *         last_name: "Doe"
 *         dateOfBirth: "2010-01-01"
 *         mfaEnabled: false
 *         children: ["63c9e5b5f5a48e1c4e7e3d90"]
 *         guardians: ["63c9e5b5f5a48e1c4e7e3d89"]
 */

/**
 * @swagger
 * /api/achievement/add:
 *   post:
 *     summary: Add a new achievement
 *     description: Add a new achievement with optional media upload.
 *     operationId: addAchievement
 *     tags:
 *       - Achievements
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               parentId:
 *                 type: string
 *               childId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Achievement added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Achievement added successfully
 *                 achievement:
 *                   $ref: '#/components/schemas/Achievement'
 *       500:
 *         description: Error adding achievement
 */

router.post('/add', upload.single('media'), async (req, res) => {
  const { title, description, category, parentId, childId } = req.body;
  let mediaUrl = null;

  // Check if media is uploaded
  if (req.file) {
    mediaUrl = req.file.path; // Store the media file path (can be changed to a cloud URL if using Cloudinary)
  }

  try {
    // Create the achievement entry
    const newAchievement = new Achievement({
      title,
      description,
      category,
      parentId,
      childId,
      media: mediaUrl
    });

    // Save the achievement to the database
    const savedAchievement = await newAchievement.save();

    res.status(201).json({
      message: 'Achievement added successfully.',
      achievement: savedAchievement
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding achievement.', error: error.message });
  }
});

/**
 * @swagger
 * /api/achievements/retrieve/{childId}:
 *   get:
 *     summary: Retrieve achievements for a specific child.
 *     tags:
 *       - Achievements
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: childId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "6795691729abc283e5598348"
 *     responses:
 *       200:
 *         description: List of achievements for the child.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "Completed Homework"
 *                   description:
 *                     type: string
 *                     example: "Successfully finished all homework assignments."
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-01T12:00:00Z"
 *                   childId:
 *                     type: string
 *                     example: "6795691729abc283e5598348"
 *       400:
 *         description: Invalid or missing childId.
 *       404:
 *         description: No achievements found for the child.
 *       500:
 *         description: Internal server error.
 */
router.get('/retrieve/:childId', getAchievements);
/**
 * @swagger
 * /api/achievement/update/{achievementId}:
 *   put:
 *     summary: Update achievement details
 *     description: Edit achievement details, including media.
 *     operationId: updateAchievement
 *     tags:
 *       - Achievements
 *     parameters:
 *       - in: path
 *         name: achievementId
 *         required: true
 *         description: The ID of the achievement to be updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Achievement updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Achievement updated successfully
 *                 achievement:
 *                   $ref: '#/components/schemas/Achievement'
 *       404:
 *         description: Achievement not found
 *       500:
 *         description: Error updating achievement
 */
router.put('/update/:achievementId', upload.single('media'), async (req, res) => {
    const { achievementId } = req.params;
    const { title, description, category } = req.body;
    let mediaUrl = null;

    if (req.file) {
      mediaUrl = req.file.path;
    }

    try {
      // Find the achievement by its ID
      const achievement = await Achievement.findById(achievementId);

      if (!achievement) {
        return res.status(404).json({ message: 'Achievement not found.' });
      }

      // Update the achievement details
      achievement.title = title || achievement.title;
      achievement.description = description || achievement.description;
      achievement.category = category || achievement.category;
      achievement.media = mediaUrl || achievement.media;

      // Save the updated achievement
      const updatedAchievement = await achievement.save();

      res.status(200).json({
        message: 'Achievement updated successfully.',
        achievement: updatedAchievement
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating achievement.', error: error.message });
    }
});

module.exports = router;  
