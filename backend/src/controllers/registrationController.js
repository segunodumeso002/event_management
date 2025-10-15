import pool from '../db.js';

export const registerForEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;
  
  try {
    // Check if event exists
    const eventCheck = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Check if already registered
    const existingReg = await pool.query(
      'SELECT * FROM registrations WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );
    if (existingReg.rows.length > 0) {
      return res.status(409).json({ message: 'Already registered for this event.' });
    }

    // Register for event
    const result = await pool.query(
      'INSERT INTO registrations (event_id, user_id) VALUES ($1, $2) RETURNING *',
      [eventId, userId]
    );
    res.status(201).json({ message: 'Successfully registered for event.', registration: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const unregisterFromEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'DELETE FROM registrations WHERE event_id = $1 AND user_id = $2 RETURNING *',
      [eventId, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Registration not found.' });
    }
    res.json({ message: 'Successfully unregistered from event.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getEventAttendees = async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await pool.query(
      'SELECT u.id, u.firstname, u.lastname, u.email, r.registered_at FROM registrations r JOIN users u ON r.user_id = u.id WHERE r.event_id = $1 ORDER BY r.registered_at',
      [eventId]
    );
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getUserRegistrations = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT e.*, r.registered_at FROM registrations r JOIN events e ON r.event_id = e.id WHERE r.user_id = $1 ORDER BY e.date',
      [userId]
    );
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};