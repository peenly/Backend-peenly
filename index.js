const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./Routes/authRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
