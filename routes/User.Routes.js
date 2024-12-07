const express = require('express')
const router = express.Router()

const {signup, signin} = require('../controllers/auth')


router.post('/', signup)
router.post('/', signin)

module.exports = router