const express = require('express')
const router = express.Router()

const {signup, signin} = require('../controllers/auth')
const { sendResetToken, resetPassword } = require('../controllers/changePassword')

router.post('/', signup)
router.post('/', signin)
router.post('/send-reset-link', sendResetToken )
router.post('/reset-password', resetPassword )

module.exports = router