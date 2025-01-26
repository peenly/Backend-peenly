const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');
const User = require('../models/User.Model'); 

// Function to send email notifications
const sendEmailNotification = async (recipientEmail, subject, message) => {
    const emailUser = process.env.EMAIL;
    const emailPass = process.env.EMAIL_PASSWORD;
  
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: emailUser,  
        pass: emailPass,  
      },
    });
  

 // Styling for the email body
 const emailBody = `
 <html>
   <body style="font-family: Arial, sans-serif; color: #333;">
     <table role="presentation" style="width: 100%; border: 0; padding: 20px; background-color: #f4f4f4;">
       <tr>
         <td style="text-align: center; padding-bottom: 20px;">
           <h1 style="color: #4CAF50;">Peenly</h1> <!-- Replace with your app name -->
         </td>
       </tr>
       <tr>
         <td>
           <h2 style="color: #555;">New Notification: ${subject}</h2>
           <p style="font-size: 16px; color: #666;">${message}</p>
         </td>
       </tr>
       <tr>
         <td style="padding-top: 20px; font-size: 12px; color: #aaa; text-align: center;">
           <p>If you have any questions, feel free to contact us!</p>
         </td>
       </tr>
     </table>
   </body>
 </html>
`;


    // Email options
    const mailOptions = {
      from: emailUser, 
      to: recipientEmail,  
      subject: subject,  
      text: message, 
      html:emailBody, 
    };
  
    try {
      // Send the email
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

// Schedule a new notification
const scheduleNotification = async (req, res) => {
    try {
      const { recipientId, type, message } = req.body;
  
      // Ensure recipient is a valid user (parent/guardian)
      const recipient = await User.findById(recipientId);
      if (!recipient) {
        return res.status(404).json({ message: 'Recipient not found' });
      }
  
      // Create a new notification
      const notification = new Notification({
        recipientId,
        type,
        message,
      });
  
      // Save the notification to the database
      await notification.save();
  
      // Send the email notification
      await sendEmailNotification(recipient.email, ` ${type}`, message);
  
      // Mark the notification as sent
      notification.status = 'sent';
      notification.sentAt = new Date();
      await notification.save();
  
      res.status(200).json({
        message: 'Notification scheduled and sent successfully',
        notification,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error scheduling notification', error: error.message });
    }
  };
  
// Fetch notifications for a user
const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate the user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get notifications for the user
    const notifications = await Notification.find({ recipientId: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Notifications fetched successfully',
      notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

module.exports = {
  scheduleNotification,
  getNotifications,
};
