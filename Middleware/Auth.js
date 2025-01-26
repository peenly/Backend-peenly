const jwt = require('jsonwebtoken');
const User = require('../models/User.Model');

exports.authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization']; // Use lowercase for header keys
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      const user = await User.findById(decoded.id); // Find the user by ID in the token
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      req.user = user; // Attach the user object to the request
      next(); // Pass control to the next middleware
    } catch (error) {
      res.status(401).json({ message: 'Invalid token.', error: error.message });
    }
  };
