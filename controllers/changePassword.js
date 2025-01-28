const User = require('../models/User.Model');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

// Generate Reset Token
const generateResetToken = async (user) => {
    const payload = { userId: user._id };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '30m' }; // Token expiration time (30 minutes)

    // Generate and save the token to the user document
    const token = jwt.sign(payload, secret, options);
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    return token;
};

// Send Reset Token
const sendResetToken = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const resetToken = await generateResetToken(user);

        // Update reset link to point to the frontend
        const resetLink = `https://peenly-two.vercel.app/reset-password/new-password?token=${resetToken}`;
        
        const emailHtml = 
            `<!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
                    .email-container { max-width: 600px; margin: auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
                    .button { padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <h1>Reset Password</h1>
                    <p>Hello,</p>
                    <p>Click the button below to reset your password:</p>
                    <p><a href="${resetLink}" class="button">Reset Password</a></p>
                    <p>This link will expire in 30 minutes.</p>
                </div>
            </body>
            </html>`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Reset Your Password',
            html: emailHtml,
        });

        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Error sending reset email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
};


// Reset Password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.resetToken !== token || user.resetTokenExpiration < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.status(200).json({ message: 'Password successfully reset' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(400).json({ error: 'Invalid or expired reset token' });
    }
};

module.exports = {
    sendResetToken,
    resetPassword,
};
