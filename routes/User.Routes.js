const express = require('express');
const router = express.Router();

const { signup, signin, validateOtp, sendOtp, getAllUsers } = require('../controllers/auth');
const { sendResetToken, resetPassword } = require('../controllers/changePassword');

/**
 * @swagger
 * /api/user/forgot-password/send-reset-token:
 *   post:
 *     summary: Send a reset token for password reset.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Reset token sent successfully.
 *       400:
 *         description: Invalid email provided.
 *       500:
 *         description: Internal server error.
 */
router.post('/forgot-password/send-reset-token', sendResetToken);

/**
 * @swagger
 * /api/user/forgot-password/reset-password/{:token}:
 *   post:
 *     summary: Reset the user's password using the reset token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: "newSecurePassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       400:
 *         description: Invalid token or new password.
 *       500:
 *         description: Internal server error.
 */
router.post('/forgot-password/reset-password/:token', resetPassword);

/**
 * @swagger
 * /api/user/validate:
 *   post:
 *     summary: Validate OTP for user authentication.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: OTP validated successfully.
 *       400:
 *         description: Invalid OTP or email.
 *       500:
 *         description: Internal server error.
 */
router.post('/validate', validateOtp);

/**
 * @swagger
 * /api/user/otp/send-otp:
 *   post:
 *     summary: Send an OTP to the user's email for validation.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               method:
 *                 type: string
 *                 enum: ["email", "sms"]
 *                 example: "email"
 *         
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *       400:
 *         description: Invalid email or phone number provided.
 *       500:
 *         description: Internal server error.
 */
router.post('/otp/send-otp', sendOtp);

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "SecurePassword123"
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Invalid user data.
 *       500:
 *         description: Internal server error.
 */
router.post('/register', signup);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login an existing user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "SecurePassword123"
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       400:
 *         description: Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
router.post('/login', signin);

/**
 * @swagger
 * /api/user/all:
 *   get:
 *     summary: Get all registered users.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully fetched all users.
 *       500:
 *         description: Internal server error.
 */
router.get('/all', getAllUsers);

module.exports = router;
