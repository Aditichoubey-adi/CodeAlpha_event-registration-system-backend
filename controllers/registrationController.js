// controllers/registrationController.js
const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User'); // Not strictly needed for logic, but good for reference if needed

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Private (User)
const registerForEvent = asyncHandler(async (req, res) => {
    // req.user is available here from the 'protect' middleware
    const userId = req.user._id;
    const { eventId } = req.body;

    if (!eventId) {
        res.status(400);
        throw new Error('Event ID is required');
    }

    const event = await Event.findById(eventId);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check if user is already registered for this event
    const existingRegistration = await Registration.findOne({ user: userId, event: eventId });
    if (existingRegistration) {
        res.status(400);
        throw new Error('You are already registered for this event');
    }

    // Check if event has capacity
    if (event.registeredAttendees.length >= event.capacity) {
        res.status(400);
        throw new Error('Event capacity reached');
    }

    // Create the registration
    const registration = await Registration.create({
        user: userId,
        event: eventId,
        status: 'confirmed' // Assuming immediate confirmation
    });

    // Add user to event's registeredAttendees array
    event.registeredAttendees.push(userId);
    await event.save(); // Save the updated event

    res.status(201).json({
        message: 'Successfully registered for event',
        registration: registration
    });
});

// @desc    Get user's registrations (all events a user is registered for)
// @route   GET /api/registrations/myregistrations
// @access  Private (User)
const getMyRegistrations = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const registrations = await Registration.find({ user: userId })
        .populate('event', 'title description date location capacity') // Populate event details
        .populate('user', 'name email'); // Optionally populate user details (though we know the user)

    res.json(registrations);
});

// @desc    Get all registrations (Admin only)
// @route   GET /api/registrations
// @access  Private/Admin
const getAllRegistrations = asyncHandler(async (req, res) => {
    const registrations = await Registration.find({})
        .populate('user', 'name email')
        .populate('event', 'title description date location capacity');
    res.json(registrations);
});

// @desc    Cancel a registration
// @route   DELETE /api/registrations/:id
// @access  Private (User/Admin)
const cancelRegistration = asyncHandler(async (req, res) => {
    const registrationId = req.params.id;
    const userId = req.user._id;

    const registration = await Registration.findById(registrationId);

    if (!registration) {
        res.status(404);
        throw new Error('Registration not found');
    }

    // Allow user to cancel their own registration OR admin to cancel any
    if (registration.user.toString() !== userId.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to cancel this registration');
    }

    // Remove user from event's registeredAttendees array
    const event = await Event.findById(registration.event);
    if (event) {
        event.registeredAttendees = event.registeredAttendees.filter(
            (attendeeId) => attendeeId.toString() !== registration.user.toString()
        );
        await event.save();
    }

    await Registration.deleteOne({ _id: registrationId }); // Delete the registration document

    res.json({ message: 'Registration cancelled successfully' });
});


module.exports = {
    registerForEvent,
    getMyRegistrations,
    getAllRegistrations,
    cancelRegistration
};