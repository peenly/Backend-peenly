
const User  = require('../models/User.Model'); 
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');


const sendResetToken = async (req, res) => {
    const email = req.body.email;
    console.log(`Looking for user with email: ${email}`); 

    let user;
    try {
        user = await User.findOne({ email: email });
        console.log(user);  // Check if user is found
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);  // More detailed error log
        return res.status(500).json({ error: 'Error fetching user' });
    }

    // Generate reset token and expiration time
    const resetToken = await generateResetToken(user);  // Ensure resetToken is generated
    console.log(resetToken);
    // Set reset token in the user's record
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + (parseInt(process.env.RESET_TOKEN_EXPIRATION_IN_MINUTES) * 60 * 1000);
    await user.save();

    // Read email template
    const emailHtml = `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
    }
    .email-container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
        text-align: center;
        margin-bottom: 20px;
    }
    .header h1 {
        color: #333;
    }
    .content {
        color: #555;
        line-height: 1.6;
    }
    .button {
        display: inline-block;
        margin: 20px 0;
        padding: 10px 20px;
        font-size: 16px;
        color: #ffffff;
        background-color: #007BFF;
        text-decoration: none;
        border-radius: 5px;
    }
    .footer {
        text-align: center;
        margin-top: 20px;
        font-size: 12px;
        color: #888;
    }
    </style>
    
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Reset Password Peenly!</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>You recently requested to reset your password. Please click the link below to proceed:</p>
            <p>
                <a href="{{resetLink}}" class="button">Reset Password</a>
            </p>
            <p>This link will expire in <strong>{{expirationTime}}</strong>.</p>
            <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
            <p>Thank you,<br>The Express Team</p>
        </div>
        <div class="footer">
            <p>&copy; {{currentYear}} Peenly. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
    // Dynamic data for email template
    const resetLink = `${process.env.RESET_BASE_URL}?token=${resetToken}`;
    const expirationTime = process.env.RESET_TOKEN_EXPIRATION_IN_MINUTES;
    const currentYear = new Date().getFullYear();

    // Replace placeholders with dynamic values
    const renderedEmail = emailHtml
        .replace('{{resetLink}}', resetLink)
        .replace('{{expirationTime}}', expirationTime)
        .replace('{{currentYear}}', currentYear);

    // Send reset password email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Reset Your Password',
        html: renderedEmail
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Failed to send email:', error);  // Log email send failure
        res.status(500).json({ error: 'Failed to send email' });
    }
};

const generateResetToken = async (user) => {
    const payload = { userId: user._id };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '30m' }; // Set token expiration time (30 minutes)

    // Generate token
    const token = jwt.sign(payload, secret, options);
    console.log('Generated Reset Token:', token);

    // Save the token to the user document (ensure consistency)
    user.resetToken = token;
    await user.save(); // Save the token to the database

    return token;
};
// Todo: Generate a reset Expiration Token Method


const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    let decoded;
    try {
        // Verify token and decode it
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ error: 'Reset token has expired' });
        }
        return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Verify user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Check if the stored reset token matches
    if (user.resetToken !== token) {
        return res.status(400).json({ error: 'Invalid reset token' });
    }

    // Check if the reset token has expired
    if (user.resetTokenExpiration < Date.now()) {
        return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear reset token and expiration
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    res.status(200).json({ message: 'Password successfully reset' });
};

module.exports = {
    sendResetToken,
    resetPassword
};