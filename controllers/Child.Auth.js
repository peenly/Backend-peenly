<<<<<<< HEAD
// Create child profile
const child = require('../models/Child.model');

const ChildAuth = async (req, res) => {
    try {
      const { name, age, privacy } = req.body;
  
      if (!name || !age || !privacy) {
        return res.status(400).json({ message: 'Send all required fields: name, age, privacy' });
      }
  
      const childProfile = new child({
        name,
        age,
        privacy,
        guardianId: req.user?.id,
      });
  
      await User.findByIdAndUpdate(req.user.id, { $push: { children: childProfile._id } });
      res.status(201).json({ message: 'Child profile created successfully', childProfile });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }

  }

  module.exports = {
    ChildAuth
  };
=======
// // Create child profile
// const child = require('../models/Child.model');

// /**
//  * @swagger
//  * /api/child/create:
//  *   post:
//  *     summary: Create a child profile.
//  *     tags:
//  *       - child
//  *     security:
//  *       - bearerAuth: []  
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: John Doe
//  *               age:
//  *                 type: integer
//  *                 example: 8
//  *               privacy:
//  *                 type: string
//  *                 enum:
//  *                   - public
//  *                   - private
//  *                 example: private
//  *     responses:
//  *       201:
//  *         description: Child profile created successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Child profile created successfully
//  *                 childProfile:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: string
//  *                       example: 63c9e5b5f5a48e1c4e7e3d89
//  *                     name:
//  *                       type: string
//  *                       example: John Doe
//  *                     age:
//  *                       type: integer
//  *                       example: 8
//  *                     privacy:
//  *                       type: string
//  *                       example: private
//  *                     guardianId:
//  *                       type: string
//  *                       example: 62c9a5b4f4a58e2c3e6d2c90
//  *       400:
//  *         description: Missing required fields.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Send all required fields: name, age, privacy
//  *       500:
//  *         description: Internal server error.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: An error occurred while creating the child profile
//  */

// const ChildAuth = async (req, res) => {
//   try {
//       const { name, age, privacy } = req.body;

//       // Logging the incoming data for debugging
//       console.log('Received data:', { name, age, privacy });

//       if (!name || !age || !privacy) {
//           return res.status(400).json({ message: 'All fields are required: name, age, privacy' });
//       }

//       const childProfile = new child({
//           name,
//           age,
//           privacy,
//           guardianId: req.user?.id,
//       });

//       // Log the childProfile before saving it
//       console.log('Child profile:', childProfile);

//       await User.findByIdAndUpdate(req.user.id, { $push: { children: childProfile._id } });

//       res.status(201).json({
//           message: 'Child profile created successfully',
//           childProfile,
//       });
//   } catch (error) {
//       console.error('Error occurred:', error.message); // Log the error
//       res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   ChildAuth,
// };
>>>>>>> origin/main
