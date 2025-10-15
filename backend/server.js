const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'event_management',
  password: 'Allsouth22$$',
  port: 5432,
});

// JWT Secret
const JWT_SECRET = 'f6c63e27661f85b68bcb9b72cb19ddd79131766bf036c82321a91d1debf9e125';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (firstname, lastname, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, firstname, lastname, email, role',
      [firstname, lastname, email, hashedPassword, role]
    );
    
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
    
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Events Routes
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, u.firstname || ' ' || u.lastname as organizer_name 
      FROM events e 
      JOIN users u ON e.organizer_id = u.id 
      ORDER BY e.date ASC
    `);
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});

app.get('/api/events/organizer', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching events for organizer ID:', req.user.userId);
    const result = await pool.query(`
      SELECT e.*, u.firstname || ' ' || u.lastname as organizer_name 
      FROM events e 
      JOIN users u ON e.organizer_id = u.id 
      WHERE e.organizer_id = $1
      ORDER BY e.date ASC
    `, [req.user.userId]);
    console.log('Found events:', result.rows.length);
    console.log('Events data:', result.rows);
    res.json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching organizer events:', error);
    res.status(500).json({ message: 'Failed to fetch organizer events', error: error.message });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { title, description, location, date } = req.body;
    console.log('Creating event for organizer ID:', req.user.userId);
    console.log('Event data:', { title, description, location, date });
    const result = await pool.query(
      'INSERT INTO events (title, description, location, date, organizer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, location, date, req.user.userId]
    );
    console.log('Created event:', result.rows[0]);
    res.status(201).json({ data: result.rows[0] });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: 'Failed to create event', error: error.message });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM events WHERE id = $1 AND organizer_id = $2', [id, req.user.userId]);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
});

// Registration Routes
app.post('/api/registrations/events/:eventId', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await pool.query(
      'INSERT INTO registrations (event_id, user_id) VALUES ($1, $2) RETURNING *',
      [eventId, req.user.userId]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    res.status(400).json({ message: 'Registration failed', error: error.message });
  }
});

app.get('/api/registrations/my-events', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, r.registered_at 
      FROM events e 
      JOIN registrations r ON e.id = r.event_id 
      WHERE r.user_id = $1 
      ORDER BY e.date ASC
    `, [req.user.userId]);
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});

app.get('/api/registrations/events/:eventId/attendees', async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await pool.query(`
      SELECT r.*, u.firstname, u.lastname, u.email, e.title as event_title, e.date as event_date, e.location as event_location
      FROM registrations r 
      JOIN users u ON r.user_id = u.id 
      JOIN events e ON r.event_id = e.id 
      WHERE r.event_id = $1
    `, [eventId]);
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendees', error: error.message });
  }
});

app.get('/api/registrations/organizer-attendees', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id,
        r.registered_at as createdAt,
        json_build_object(
          'firstname', u.firstname,
          'lastname', u.lastname,
          'email', u.email
        ) as user,
        json_build_object(
          'id', e.id,
          'title', e.title,
          'date', e.date,
          'location', e.location
        ) as event
      FROM registrations r 
      JOIN users u ON r.user_id = u.id 
      JOIN events e ON r.event_id = e.id 
      WHERE e.organizer_id = $1
      ORDER BY r.registered_at DESC
    `, [req.user.userId]);
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendees', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});