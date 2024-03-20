const express = require("express")
const { login, me, logout } = require("./auth.service")

const router = express.Router()

router.post('/login', login)
router.get('/me', me)
router.delete('/logout', logout)


module.exports = router

