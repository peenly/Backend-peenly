const express = require('express');
const { sendOtp, validateOtp, login } = require('../Controllers/authController');

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/validate-otp', validateOtp);
router.post('/login', login);

module.exports = router;