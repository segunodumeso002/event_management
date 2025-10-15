import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../components/AlertProvider';
import { eventsAPI, registrationAPI } from '../services/api';
import { format } from 'date-fns';

const Dashboard = ({ user, token }) => {
  const [userEvents, setUserEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    category: 'general'
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventCounts, setEventCounts] = useState({});
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!user || !token) {
      navigate('/');
      return;
    }
    fetchUserEvents();
  }, [user, token, navigate]);

  const fetchUserEvents = async () => {
    try {
      console.log('Fetching events for user:', user.role);
      if (user.role === 'attendee') {
        const response = await registrationAPI.getUserEvents(token);
        console.log('Attendee events response:', response);
        setUserEvents(response.data?.data || []);
      } else {
        // For organizers, get only their events
        console.log('Fetching organizer events with token:', token?.substring(0, 20) + '...');
        const response = await eventsAPI.getOrganizerEvents(token);
        console.log('Organizer events response:', response);
        const events = response.data?.data || [];
        console.log('Events data:', events);
        setUserEvents(events);
        // Fetch registration counts for organizer events
        if (events.length > 0) {
          fetchEventCounts(events);
        }
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
      console.error('Error details:', err.response?.data);
      setUserEvents([]);
      showAlert('Failed to fetch events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventCounts = async (events) => {
    try {
      const counts = {};
      for (const event of events) {
        try {
          const response = await registrationAPI.getAttendees(event.id);
          counts[event.id] = response.data?.data?.length || 0;
        } catch (eventErr) {
          console.error(`Failed to fetch count for event ${event.id}:`, eventErr);
          counts[event.id] = 0;
        }
      }
      setEventCounts(counts);
    } catch (err) {
      console.error('Failed to fetch event counts:', err);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await eventsAPI.update(editingEvent.id, newEvent, token);
        showAlert('Event updated successfully!', 'success');
      } else {
        await eventsAPI.create(newEvent, token);
        showAlert('Event created successfully!', 'success');
      }
      setNewEvent({ title: '', description: '', location: '', date: '', category: 'general' });
      setShowForm(false);
      setEditingEvent(null);
      await fetchUserEvents();
    } catch (err) {
      showAlert(editingEvent ? 'Failed to update event' : 'Failed to create event', 'error');
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      location: event.location,
      date: new Date(event.date).toISOString().slice(0, 16),
      category: event.category || 'general'
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setNewEvent({ title: '', description: '', location: '', date: '', category: 'general' });
    setShowForm(false);
  };

  const isEventPast = (eventDate) => {
    return new Date(eventDate) < new Date();
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.delete(eventId, token);
        fetchUserEvents();
        showAlert('Event deleted successfully!', 'success');
      } catch (err) {
        showAlert('Failed to delete event', 'error');
      }
    }
  };

  if (!user) {
    return <div className="error">Please login to access dashboard</div>;
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="events-container">
      <h1>Dashboard - Welcome {user.firstname}!</h1>
      
      {user.role === 'organizer' && (
        <div className="organizer-section">
          <button 
            className="btn btn-primary"
            onClick={() => showForm ? handleCancelEdit() : setShowForm(true)}
          >
            {showForm ? 'Cancel' : 'Create New Event'}
          </button>
          
          {showForm && (
            <form className="event-form" onSubmit={handleCreateEvent}>
              <input
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
              <input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              />
              <input
                type="datetime-local"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                required
              />
              <select
                value={newEvent.category}
                onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                required
              >
                <option value="general">General</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="networking">Networking</option>
                <option value="social">Social</option>
                <option value="sports">Sports</option>
                <option value="music">Music</option>
                <option value="business">Business</option>
                <option value="religion">Religion</option>
              </select>
              <button type="submit" className="btn btn-primary">
                {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="events-section">
        <h2>
          {user.role === 'attendee' ? 'My Registered Events' : 'My Events'}
        </h2>
        
        <div className="events-grid">
          {userEvents && userEvents.length > 0 ? userEvents.map(event => {
            const isPast = isEventPast(event.date);
            return (
              <div key={event.id} className={`glass-card event-card ${isPast ? 'event-past' : ''}`}>
                <div className="event-status">
                  {isPast ? (
                    <span className="status-badge status-done">✅ Done</span>
                  ) : (
                    <span className="status-badge status-upcoming">🕒 Upcoming</span>
                  )}
                </div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>📍 {event.location}</p>
                <p>📅 {format(new Date(event.date), 'PPP p')}</p>
                
                {user.role === 'organizer' && (
                  <div className="event-stats">
                    <span className="attendee-count">
                      👥 {eventCounts[event.id] || 0} registered
                    </span>
                  </div>
                )}
                
                {user.role === 'organizer' && (
                  <div className="event-actions">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleEditEvent(event)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          }) : (
            <div className="no-events">
              <h3>No events found</h3>
              <p>{user.role === 'attendee' ? 'You haven\'t registered for any events yet.' : 'You haven\'t created any events yet.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;