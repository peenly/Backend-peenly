const usermod = require('../models/User.Model');
const bcrypt = require('bcrypt');

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

        // Create the user with the hashed password
        const userReg = await usermod.create({
            fullname,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User registered successfully', user: userReg });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    signin,
    signup,
};
