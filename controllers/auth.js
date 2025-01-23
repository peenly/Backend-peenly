const usermod = require('../models/User.Model');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const otpStore = {}

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
}


/**
 * @swagger
 * /api/user/otp/send-otp:
 *   post:
 *     summary: Send an OTP to the user's email.
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
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully
 *       400:
 *         description: Bad request, email is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email is required
 *       500:
 *         description: Failed to send OTP or other server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to send OTP
 *                 error:
 *                   type: string
 *                   example: Error details here
 */



// Function to send OTP
const sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp; // Store OTP temporarily

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP for Peenly Login',
        text: `Your OTP is ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP', error });
    }
};


/**
 * @swagger
 * /api/user/register:
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

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Create the user with the hashed password
        const userReg = await usermod.create({
            fullname,
            email,
            password: hashedPassword,
            otpCode: otp,
        });


    // Configure nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP for Peenly Login',
        text: `Your OTP is ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP', error });
    }


        res.status(201).json({ message: 'User registered successfully', user: userReg });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @swagger
 * /api/user/otp/validate:
 *   post:
 *     summary: validate user otp.
 *     tags:
 *       - user
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email address of the user resetting the password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: 000000
 *     responses:
 *       200:
 *         description: User registered successfully.
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
 *                   example: User registered successfully
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
// Validate OTP
const validateOtp = async (req, res) => {
    const {otp}  = req.body;

    //get the email from the quury parameter
    const {email} = req.query;

    // Check if the user exists
    const existingUser = await usermod.findOne({ email });
    if (!existingUser) {
        return res.status(409).json({ message: 'User does not exist' });
    }

    if (existingUser.otpCode === otp) {
        //delete otpStore[email]; 
        res.status(200).json({ message: 'OTP validated successfully' });
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
};


module.exports = {
    signin,
    signup,
    validateOtp,
    sendOtp,
};
