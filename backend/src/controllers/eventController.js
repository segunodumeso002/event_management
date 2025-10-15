import pool from '../db.js';

export const createEvent = async (req, res) => {
  const { title, description, location, date, category } = req.body;
  if (!title || !date) {
    return res.status(400).json({ message: 'Title and date are required.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO events (title, description, location, date, category, organizer_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, location, date, category || 'general', req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT e.*, CONCAT(u.firstname, \' \', u.lastname) as organizer_name FROM events e JOIN users u ON e.organizer_id = u.id ORDER BY e.date'
    );
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT e.*, CONCAT(u.firstname, \' \', u.lastname) as organizer_name FROM events e JOIN users u ON e.organizer_id = u.id WHERE e.id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, location, date, category } = req.body;
  try {
    const result = await pool.query(
      'UPDATE events SET title = $1, description = $2, location = $3, date = $4, category = $5 WHERE id = $6 AND organizer_id = $7 RETURNING *',
      [title, description, location, date, category || 'general', id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found or unauthorized.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    // First delete all registrations for this event
    await pool.query('DELETE FROM registrations WHERE event_id = $1', [id]);
    
    // Then delete the event
    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 AND organizer_id = $2 RETURNING *',
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found or unauthorized.' });
    }
    res.json({ message: 'Event deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getOrganizerEvents = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT e.*, CONCAT(u.firstname, \' \', u.lastname) as organizer_name FROM events e JOIN users u ON e.organizer_id = u.id WHERE e.organizer_id = $1 ORDER BY e.date',
      [req.user.id]
    );
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};