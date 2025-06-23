const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true // Remove whitespace from both ends of a string
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date, // Store date and time
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1 // Minimum capacity of 1 person
    },
    registeredAttendees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // Reference to the User model
        }
    ],
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (the admin who created the event)
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;