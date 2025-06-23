const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken');     // For creating JWTs
const asyncHandler = require('express-async-handler'); // Simple wrapper for async functions
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400); // Bad Request
        throw new Error('User already exists');
    }

    // Create new user
    const user = await User.create({
        name,
        email,
        password, // Password will be hashed by the pre-save middleware in User.js
        role: role || 'user', // Default to 'user' if role not provided
    });

    if (user) {
        res.status(201).json({ // Created
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id), // Generate and send JWT
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user by email
    const user = await User.findOne({ email });

    // If user exists and password matches
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401); // Unauthorized
        throw new Error('Invalid email or password');
    }
});

module.exports = { registerUser, loginUser };