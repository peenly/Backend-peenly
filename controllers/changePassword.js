const usermod = require('../models/User.Model');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');


const sendResetToken = async (req, res) => {
    const email = req.body.email;
    let user = {}
    try {
        user = await usermod.findOne({email: email})
        console.log(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: 'Failed to fetch user' }) 
    }

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
  
    // Read the HTML template file
    const emailTemplatePath = path.join(__dirname, '../resources', 'password-reset-email.html');
    let emailHtml;
    try {
        emailHtml = await readFileAsync(emailTemplatePath);
    } catch (error) {
        console.error('Error reading email template:', error);
        return res.status(500).json({ error: 'Failed to load email template' });
    }

    // Dynamic data
    const resetLink = `${process.env.RESET_BASE_URL}?email=${email}`;
    const expirationTime = process.env.RESET_TOKEN_EXPIRATION_IN_MINUTES;
    const currentYear = new Date().getFullYear();

    // Replace placeholders with dynamic data
    const renderedEmail = emailHtml
        .replace('{{resetLink}}', resetLink)
        .replace('{{expirationTime}}', expirationTime)
        .replace('{{currentYear}}', currentYear);


    // Configure the mail transporter
    const trans = transporter();
    
    // Configure the mail options
    const data = mailOptions(email, renderedEmail);

    try {
        await sendMail(trans, data);
        return res.status(200).json({ message: 'Password reset email sent successfully', email: email });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send email' });
    }
};

// Function to read a file asynchronously using Promises
const readFileAsync = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

// Configure nodemailer transporter
const transporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Configure mail options
const mailOptions = (userEmail, renderedEmail) => {
    return {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Reset your Peenly password",
        html: renderedEmail,
    };
};

// Send email
const sendMail = async (transporter, mailOptions) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(err);
            } else {
                console.log('Email sent:', info.response);
                resolve(info);
            }
        });
    });
};


// Todo: Generate a reset Expiration Token Method


const resetPassword = async (req, res) => {
    const {newPassword, confirmedPassword} = req.body

    if (!newPassword || !confirmedPassword) {
        return res.status(400).json({ message: "Both passwords are required." });
    }

    if (newPassword !== confirmedPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    //get the email from the quury parameter
    const {email} = req.query;

    let user = {}
    try {
        user = await usermod.findOne({email: email})
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: 'Failed to fetch user' }) 
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    //
    user.password = hashedPassword;

    const updatedUser = await usermod.findOneAndUpdate({ email }, user, { new: true, runValidators: true });

    return res.status(200).json(updatedUser);

}


module.exports = {
    sendResetToken,
    resetPassword
};