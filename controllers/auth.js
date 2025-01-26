const usermod = require('../models/User.Model');
const UserModel = require('../models/User.Model'); 
const OtpModel = require('../models/OtpModel'); // Adjust the path according to your folder structure
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const otpStore = {}
const Africastalking = require('africastalking');


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

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id }, // Payload containing the user ID
            process.env.JWT_SECRET, // Secret key for encoding the token
            { expiresIn: '1h' } // Token expiration time (1 hour)
        );

        // Send response with the token
        res.status(200).json({
            message: 'Login successful',
            token // Include the token in the response
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




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



// Validate OTP

const validateOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }


    // Check if the user exists
    const existingUser = await usermod.findOne({ email });
    if (!existingUser) {
        return res.status(409).json({ message: 'User does not exist' });
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




// Function to fetch all registered parents
const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await UserModel.find({}, '_id first_name last_name email');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching users' });
    }
};
module.exports = {
    signin,
    signup,
    validateOtp,
    sendOtp,
    getAllUsers,
};
