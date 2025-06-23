// models/Registration.js
const mongoose = require('mongoose');

const registrationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User who registered
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event', // Reference to the Event they registered for
        required: true
    },
    registrationDate: {
        type: Date,
        default: Date.now // Automatically set to current date/time on creation
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'], // Status of the registration
        default: 'confirmed' // Assuming immediate confirmation for simplicity
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Ensure a user can only register for a specific event once
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;