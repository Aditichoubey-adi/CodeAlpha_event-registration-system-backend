const express = require('express');
const router = express.Router(); // Create a new router instance
const { registerUser, loginUser } = require('../controllers/authController');

// Define authentication routes
router.post('/register', registerUser); // Route for user registration
router.post('/login', loginUser);     // Route for user login



module.exports = router;