import express from 'express';
import { registerForEvent, unregisterFromEvent, getEventAttendees, getUserRegistrations } from '../controllers/registrationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register for an event (authenticated users)
router.post('/events/:eventId', authenticate, registerForEvent);

// Unregister from an event (authenticated users)
router.delete('/events/:eventId', authenticate, unregisterFromEvent);

// Get attendees for an event (public)
router.get('/events/:eventId/attendees', getEventAttendees);

// Get user's registered events (authenticated users)
router.get('/my-events', authenticate, getUserRegistrations);

export default router;