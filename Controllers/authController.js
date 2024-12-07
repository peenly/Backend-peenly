const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const otpStore = {}; // Temporary storage for OTPs

// Send OTP
exports.sendOtp = async (req, res) => {
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

// Validate OTP
exports.validateOtp = (req, res) => {
    const { email, otp } = req.body;
    if (otpStore[email] === otp) {
        delete otpStore[email]; 
        res.status(200).json({ message: 'OTP validated successfully' });
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
};

// Login
exports.login = (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
};