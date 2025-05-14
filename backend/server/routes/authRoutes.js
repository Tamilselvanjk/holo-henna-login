// routes/authRoutes.js
const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

// Initiate Google auth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
}))

// Google callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login?error=auth_failed',
    session: false
  }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { userId: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Redirect to frontend profile page with token
      res.redirect(`${process.env.FRONTEND_URL}/profile?token=${token}`);
    } catch (error) {
      console.error('Token generation error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }
)

module.exports = router;
