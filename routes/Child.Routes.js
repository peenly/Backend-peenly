const express = require('express');
const router = express.Router();
const { addChild, updateChild, deleteChild, getChildren } = require('../controllers/Child.Auth');
const { authenticate } = require('../Middleware/Auth'); 
const User = require('../models/User.Model');
const Child = require('../models/Child.model');

/**
 * @swagger
 * /api/child/add-child:
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
 *             required:
 *               - parentId
 *               - firstName
 *               - lastName
 *               - age
 *               - hobbies
 *             properties:
 *               parentId:
 *                 type: string
 *                 example: "60dabc9d1f1b2c3d2f2f4abc"
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               age:
 *                 type: integer
 *                 example: 8
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["reading", "swimming"]
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
 *                   example: "Child added successfully."
 *                 child:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "63c9e5b5f5a48e1c4e7e3d89"
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     age:
 *                       type: integer
 *                       example: 8
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal server error.
 */

// Add a child
router.post('/add-child', async (req, res) => {
    const { parentId, firstName, lastName, age, hobbies } = req.body;
  
    try {
      // Check if parent exists
      const parent = await User.findById(parentId);
      if (!parent) {
        return res.status(404).json({ message: 'Parent not found.' });
      }
  
      // Create the child profile
      const child = new Child({
        firstName,
        lastName,
        age,
        hobbies,
        parent: parentId, // Associate the parent ID
      });
  
      // Save the child to the database
      const savedChild = await child.save();
  
      // Add the child to the parent's children array
      parent.children.push(savedChild._id);
      await parent.save();
  
      res.status(201).json({
        message: 'Child added successfully.',
        child: savedChild,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error adding child.',
        error: error.message,
      });
    }
  });

/**
 * @swagger
 * /api/child/update-child/{childId}:
 *   put:
 *     summary: Update a child profile.
 *     tags:
 *       - Child
 *     parameters:
 *       - name: childId
 *         in: path
 *         required: true
 *         description: ID of the child to be updated
 *         type: string
 *         example: 63c9e5b5f5a48e1c4e7e3d89
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John Updated
 *               lastName:
 *                 type: string
 *                 example: Doe Updated
 *               age:
 *                 type: integer
 *                 example: 9
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["drawing", "sports"]
 *     responses:
 *       200:
 *         description: Child profile updated successfully.
 *       404:
 *         description: Child profile not found.
 *       500:
 *         description: Error updating child profile.
 */

// update a child
router.put('/update-child/:childId', async (req, res) => {
  const { firstName, lastName, age, hobbies } = req.body;
  const { childId } = req.params;

  // Check if all fields are provided
  if (!firstName || !lastName || !age || !hobbies) {
      return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
      // Find the child by its ID
      const child = await Child.findById(childId);

      if (!child) {
          return res.status(404).json({ message: 'Child not found.' });
      }

      // Update child profile
      child.firstName = firstName;
      child.lastName = lastName;
      child.age = age;
      child.hobbies = hobbies;

      // Save the updated child profile
      const updatedChild = await child.save();

      res.status(200).json({
          message: 'Child profile updated successfully.',
          child: updatedChild,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          message: 'Error updating child profile.',
          error: error.message,
      });
  }
});

/**
 * @swagger
 * /api/child/delete-child/{childId}:
 *   delete:
 *     summary: Delete a child profile.
 *     tags:
 *       - Child
 *     parameters:
 *       - name: childId
 *         in: path
 *         required: true
 *         description: ID of the child to be deleted
 *         type: string
 *         example: 63c9e5b5f5a48e1c4e7e3d89
 *     responses:
 *       200:
 *         description: Child profile deleted successfully.
 *       404:
 *         description: Child profile not found.
 *       500:
 *         description: Error deleting child profile.
 */

// Delete child profile
router.delete('/delete-child/:childId', async (req, res) => {
    const { childId } = req.params;
  
    try {
      // Find the child to delete
      const child = await Child.findById(childId);
      
      if (!child) {
        return res.status(404).json({ message: 'Child not found.' });
      }
  
      // Remove the child from the parent's children array
      const parent = await User.findById(child.parent);
      if (!parent) {
        return res.status(404).json({ message: 'Parent not found.' });
      }
  
      parent.children = parent.children.filter((childIdInParent) => {
        return childIdInParent.toString() !== childId;
      });
      await parent.save();
  
      // Delete the child from the Child collection
      await Child.findByIdAndDelete(childId);
  
      res.status(200).json({
        message: 'Child profile deleted successfully.',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error deleting child profile.',
        error: error.message,
      });
    }
  });

/**
 * @swagger
 * /api/child/list/{parentId}:
 *   get:
 *     summary: Get all children of a parent.
 *     tags:
 *       - Child
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of children for the authenticated parent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 children:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "63c9e5b5f5a48e1c4e7e3d89"
 *                       firstName:
 *                         type: string
 *                         example: John
 *                       lastName:
 *                         type: string
 *                         example: Doe
 *                       age:
 *                         type: integer
 *                         example: 8
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error.
 */

// Get all children of a parent
router.get('/list/:parentId', async (req, res) => {
  try {
      const { parentId } = req.params; // Get parentId from request params

      // Find children belonging to the specified parentId
      const children = await Child.find({ parent: parentId });

      // If no children found
      if (children.length === 0) {
          return res.status(404).json({ message: 'No children found for this parent.' });
      }

      res.status(200).json({ children });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching children', error: error.message });
  }
});

module.exports = router;
