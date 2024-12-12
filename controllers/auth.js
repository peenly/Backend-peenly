const usermod = require('../models/User.Model');
const bcrypt = require('bcrypt');

/**
 * @swagger
 * /api/user/register/login:
 *   post:
 *     summary: login user.
 *     tags:
 *       - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "abc123"
 *     responses:
 *       200:
 *         description: Password reset email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 
 *       500:
 *         description: uanble to send in or other server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to send email
 */

// User Signin Function
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await usermod.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No record found' });
        }

        // Compare the plaintext password with the hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Password incorrect' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * @swagger
 * /api/user/register/:
 *   post:
 *     summary: create user.
 *     tags:
 *       - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: fullname
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "abc123"
 *     responses:
 *       200:
 *         description: Password reset email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 
 *       500:
 *         description: uanble to send in or other server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to send email
 */
// User Signup Function
const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Validate required fields
        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: 'Send all required fields: fullname, email, password',
            });
        }

        // Check if the email is already in use
        const existingUser = await usermod.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user with the hashed password
        const userReg = await usermod.create({
            fullname,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User registered successfully', user: userReg });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    signin,
    signup,
};
