// routes/registrations.js
const express = require('express');
const router = express.Router();
const {
    registerForEvent,
    getMyRegistrations,
    getAllRegistrations,
    cancelRegistration
} = require('../controllers/registrationController'); // <--- Correct path
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes (none for registrations typically)

// Private routes (require authentication)
router.post('/', protect, registerForEvent);
router.get('/myregistrations', protect, getMyRegistrations);

// Admin-only routes (require authentication and admin role)
// Note: The GET '/' route here for getAllRegistrations conflicts with the GET '/myregistrations'
// It's better to make the admin route more specific, like '/admin' or '/all'
// Let's change this to '/all' for clarity and to avoid conflict with /myregistrations
router.get('/all', protect, admin, getAllRegistrations); // Changed from '/' to '/all' for admin get all

router.delete('/:id', protect, cancelRegistration);

module.exports = router;