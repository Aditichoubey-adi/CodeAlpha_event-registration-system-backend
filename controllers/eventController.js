const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const User = require('../models/User'); // Needed to check user roles if not already done by middleware

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({}).populate('organizer', 'name email'); // Populate organizer's name and email
    res.json(events);
});

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email').populate('registeredAttendees', 'name email');

    if (event) {
        res.json(event);
    } else {
        res.status(404); // Not Found
        throw new Error('Event not found');
    }
});

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = asyncHandler(async (req, res) => {
    // req.user is available here because of the 'protect' middleware
    // and its role is checked by 'admin' middleware

    const { title, description, date, location, capacity } = req.body;

    if (!title || !description || !date || !location || !capacity) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }

    const event = new Event({
        title,
        description,
        date,
        location,
        capacity,
        organizer: req.user._id, // Assign the logged-in admin as organizer
        registeredAttendees: [] // Start with an empty array
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent); // 201 Created
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = asyncHandler(async (req, res) => {
    const { title, description, date, location, capacity } = req.body;

    const event = await Event.findById(req.params.id);

    if (event) {
        // Optional: Check if the logged-in user is the organizer (more granular control)
        // if (event.organizer.toString() !== req.user._id.toString()) {
        //     res.status(401);
        //     throw new Error('Not authorized to update this event');
        // }

        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.location = location || event.location;
        event.capacity = capacity || event.capacity;

        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        // Optional: Check if the logged-in user is the organizer
        // if (event.organizer.toString() !== req.user._id.toString()) {
        //     res.status(401);
        //     throw new Error('Not authorized to delete this event');
        // }

        await Event.deleteOne({ _id: req.params.id }); // Mongoose 6+ uses deleteOne/deleteMany
        res.json({ message: 'Event removed' });
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
};