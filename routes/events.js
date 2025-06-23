const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware'); // Import middleware

// Public routes (anyone can view events)
router.get('/', getEvents);
router.get('/:id', getEventById);

// Admin-only routes (protected by protect and admin middleware)
router.post('/', protect, admin, createEvent);
router.put('/:id', protect, admin, updateEvent);
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;