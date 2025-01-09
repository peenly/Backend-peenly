const usermod = require('../models/User.Model');
const UserModel = require('../models/User.Model'); 
const OtpModel = require('../models/OtpModel'); // Adjust the path according to your folder structure

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const otpStore = {}
const Africastalking = require('africastalking');



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
 * /api/user/otp/send-otp:
 *   post:
 *     summary: Send an OTP to the user's email or phone Number.
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
 *               phone:
 *                 type: string
 *                 example: "+23476567890"
 *               method:
 *                 type: string
 *                 enum:
 *                   - email
 *                   - sms
 *                 example: email
 *                 description: The method by which the OTP should be sent. Choose either 'email' or 'sms'.
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
 *                   example: OTP sent successfully via email
 *       400:
 *         description: Bad request, invalid or missing data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email or Phone Number is required, and method must be 'email' or 'sms'.
 *       404:
 *         description: User not found for the provided email or phone.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
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
    try {
        const { email, phoneNumber, method } = req.body;

        if (!email && !phoneNumber) {
            return res.status(400).json({ message: 'Email or Phone Number is required' });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to database with 5 minutes expiration
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        const otpData = new OtpModel({ email, otpCode: otp, expiresAt });
        await otpData.save();

        if (method === 'email') {
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

            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: 'OTP sent to email successfully' });
        } else if (method === 'sms' && phoneNumber) {
            const africastalking = Africastalking({
                username: process.env.AFRICASTALKING_USERNAME,
                apiKey: process.env.AFRICASTALKING_API_KEY,
            });

            const sms = africastalking.SMS;
            const message = `Your OTP for Peenly Login is ${otp}`;

            const options = {
                to: [phoneNumber],
                message: message,
            };

            await sms.send(options);
            return res.status(200).json({ message: 'OTP sent to phone number successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid method. Use "email" or "sms"' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while sending OTP', error: error.message });
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
        const { first_name, last_name, email, password } = req.body;

        // Ensure all fields are provided and not empty
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the email is already in use
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new UserModel({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            isVerified: false, // Initially set user as unverified
        });

        await user.save();

        // Generate OTP and send it
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpData = new OtpModel({
            email,
            otpCode: otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // OTP expires in 5 minutes
        });

        await otpData.save();

        // Send OTP via email
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
            subject: 'Your OTP for Signup',
            text: `Your OTP is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent successfully. Please verify your email.' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Failed to sign up and send OTP', error: error.message });
    }
};




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
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        // Find OTP record
        const otpRecord = await OtpModel.findOne({ email, otpCode: otp });
        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP not found or expired' });
        }

        // Check if OTP has expired
        const currentTime = new Date();
        if (otpRecord.expiresAt < currentTime) {
            await OtpModel.deleteOne({ email, otpCode: otp });
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Mark user as verified
        const user = await UserModel.findOneAndUpdate(
            { email },
            { isVerified: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete OTP after successful verification
        await OtpModel.deleteOne({ email, otpCode: otp });

        return res.status(200).json({
            message: 'Email successfully verified! Your account is now activated.',
            user: { id: user._id, email: user.email, first_name: user.first_name, last_name: user.last_name },
        });
    } catch (error) {
        console.error('Error during OTP verification:', error);
        return res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
    }
};






module.exports = {
    signin,
    signup,
    validateOtp,
    sendOtp,
};
