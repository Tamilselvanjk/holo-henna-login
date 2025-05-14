const express = require('express');
const cors = require('cors');

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.REACT_APP_FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:5000',
      'https://accounts.google.com'  // Allow Google OAuth callbacks
    ];
    
    // Development mode check
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Production checks
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Authorization'],
  maxAge: 86400, // 24 hours in seconds
  preflightContinue: false,
  optionsSuccessStatus: 204
};

module.exports = cors(corsOptions);