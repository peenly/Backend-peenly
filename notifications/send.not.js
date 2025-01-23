const nodemailer = require('nodemailer');

const sendNotification = async (email, subject, message) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: 'no-reply@peenly.com',
        to: email,
        subject,
        text: message,
    });
};

module.exports = sendNotification;
