import express from 'express'
import { login, logout, refreshToken, signup, getProfile, authGoogleCallback } from '../controllers/auth.controller.ts'
import { protectRoute } from '../middleware/protect.middleware.ts'
import passport from 'passport';
const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)
router.post('/refresh-token', refreshToken)
router.get('/profile', protectRoute, getProfile)
router.get('/google', passport.authenticate("google", {
    scope: ['profile', 'email']
}))
router.get('/google/callback', passport.authenticate('google', {
    session: false,
    failureRedirect: "http://localhost:5173/login",
}), authGoogleCallback)

export default router