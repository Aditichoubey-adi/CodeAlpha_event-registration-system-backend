const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures email addresses are unique
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Define allowed roles
        default: 'user' // Default role for new users
    },
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

// --- Password Hashing Middleware ---
// This will run before saving a user if the password field is modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next(); // If password not modified, move to next middleware
    }
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
});

// --- Password Comparison Method ---
// This will be a method available on user documents to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;