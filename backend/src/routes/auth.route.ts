import express from 'express'
import { login, logout, refreshToken, signup,getProfile } from '../controllers/auth.controller.ts'
import { protectRoute } from '../middleware/protect.middleware.ts'

const router = express.Router()

router.post('/login',login)
router.post('/signup',signup)
router.post('/logout',logout)
router.post('/refresh-token',refreshToken)
router.get('/profile',protectRoute,getProfile)


export default router