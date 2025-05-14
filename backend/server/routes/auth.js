const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const axios = require('axios')
const User = require('../models/User')

// ✅ Passport Strategy Setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI, // Should match redirect URI in Google Console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value })

        if (!user) {
          user = await User.create({
            email: profile.emails[0].value,
            name: profile.displayName,
            googleId: profile.id,
            picture: profile.photos[0].value,
            verified: true,
          })
        }

        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

// ✅ Google OAuth Routes
router.get('/google', 
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
)

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      const token = jwt.sign(
        { userId: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Direct redirect to profile
      const redirectUrl = new URL('/profile', process.env.FRONTEND_URL);
      redirectUrl.searchParams.append('token', token);
      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('Auth error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

// Protected route for profile
router.get('/me', 
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password')
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.json(user)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile' })
    }
  }
)

module.exports = router
