# Backend Setup Instructions

## Prerequisites
1. Install PostgreSQL on your system
2. Install Node.js

## Database Setup
1. Create a PostgreSQL database named `event_management`
2. Run the SQL commands from `db_schema.sql` to create tables
3. Update database credentials in `server.js`:
   - user: your PostgreSQL username
   - password: your PostgreSQL password
   - database: event_management

## Install Dependencies
```bash
cd backend
npm install
```

## Run the Server
```bash
npm run dev
```

The server will run on http://localhost:5001

## API Endpoints
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- GET /api/events - Get all events
- POST /api/events - Create event (organizer only)
- DELETE /api/events/:id - Delete event (organizer only)
- POST /api/registrations/events/:eventId - Register for event
- GET /api/registrations/my-events - Get user's registered events
- GET /api/registrations/organizer-attendees - Get attendees for organizer's events
- GET /api/registrations/events/:eventId/attendees - Get attendees for specific event