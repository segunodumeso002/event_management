import express from 'express';
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent, getOrganizerEvents } from '../controllers/eventController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all events (public)
router.get('/', getEvents);

// Get organizer events (organizers only)
router.get('/organizer', authenticate, authorizeRoles('organizer'), getOrganizerEvents);

// Get event by ID (public)
router.get('/:id', getEventById);

// Create event (organizers only)
router.post('/', authenticate, authorizeRoles('organizer'), createEvent);

// Update event (organizers only, own events)
router.put('/:id', authenticate, authorizeRoles('organizer'), updateEvent);

// Delete event (organizers only, own events)
router.delete('/:id', authenticate, authorizeRoles('organizer'), deleteEvent);

export default router;