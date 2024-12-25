const express = require('express')
const router = express.Router()

const {signup, signin} = require('../controllers/auth')




router.post('/api/signup', signup)
router.post('/api/signin', signin)



module.exports = router