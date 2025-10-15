import { useState, useEffect } from 'react';
import { useAlert } from '../components/AlertProvider';
import { eventsAPI, registrationAPI } from '../services/api';
import { format } from 'date-fns';
import EventCategories from '../components/EventCategories';
import AdvancedSearch from '../components/AdvancedSearch';
import GoogleMapComponent from '../components/GoogleMap';
import PaymentForm from '../components/PaymentForm';
import emailService from '../services/emailService';

const Events = ({ user, token }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentEvent, setPaymentEvent] = useState(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      console.log('Fetching all events...');
      const response = await eventsAPI.getAll();
      console.log('All events response:', response);
      console.log('Events data:', response.data?.data);
      const eventsData = response.data?.data || [];
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      setError('');
    } catch (err) {
      console.error('Failed to fetch events:', err);
      console.error('Error details:', err.response?.data);
      setEvents([]);
      setFilteredEvents([]);
      setError('Failed to fetch events');
      showAlert('Failed to fetch events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    if (!user || !token) {
      showAlert('Please login to register for events', 'warning');
      return;
    }

    const event = events.find(e => e.id === eventId);
    if (event && event.price > 0) {
      setPaymentEvent(event);
      setShowPayment(true);
    } else {
      await processRegistration(eventId);
    }
  };

  const processRegistration = async (eventId) => {
    try {
      await registrationAPI.register(eventId, token);
      const event = events.find(e => e.id === eventId);
      
      if (event) {
        await emailService.sendEventRegistrationConfirmation(
          user.email,
          user.name,
          {
            ...event,
            registrationId: Date.now()
          }
        );
      }
      
      showAlert('Successfully registered for event!', 'success');
    } catch (err) {
      showAlert(err.response?.data?.message || 'Registration failed', 'error');
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterEvents(category, events);
  };

  const filterEvents = (category, eventsList) => {
    if (category === 'all') {
      setFilteredEvents(eventsList);
    } else {
      const filtered = eventsList.filter(event => 
        event.category?.toLowerCase() === category.toLowerCase()
      );
      setFilteredEvents(filtered);
    }
  };

  const handleSearch = (filters) => {
    let filtered = [...events];

    if (filters.keyword) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    if (filters.location) {
      filtered = filtered.filter(event =>
        event.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(event => new Date(event.date) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(event => new Date(event.date) <= new Date(filters.dateTo));
    }

    if (filters.priceMin) {
      filtered = filtered.filter(event => event.price >= parseFloat(filters.priceMin));
    }

    if (filters.priceMax) {
      filtered = filtered.filter(event => event.price <= parseFloat(filters.priceMax));
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return a.price - b.price;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return new Date(a.date) - new Date(b.date);
      }
    });

    setFilteredEvents(filtered);
  };

  const handleSearchReset = () => {
    setFilteredEvents(events);
    setSelectedCategory('all');
  };

  const handlePaymentSuccess = async (result) => {
    setShowPayment(false);
    await processRegistration(paymentEvent.id);
    setPaymentEvent(null);
  };

  const handlePaymentError = (error) => {
    showAlert(error, 'error');
  };

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>All Events</h1>
        <div className="view-toggles">
          <button 
            className={`btn ${!showMap ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowMap(false)}
          >
            📋 List View
          </button>
          <button 
            className={`btn ${showMap ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowMap(true)}
          >
            🗺️ Map View
          </button>
        </div>
      </div>

      <AdvancedSearch onSearch={handleSearch} onReset={handleSearchReset} />
      
      <EventCategories 
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {showMap ? (
        <div className="map-container">
          <GoogleMapComponent 
            events={filteredEvents}
            selectedEvent={selectedEvent}
            onEventSelect={setSelectedEvent}
          />
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents && filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div key={event.id} className="glass-card event-card">
                <div className="event-header">
                  <h3>{event.title}</h3>
                  {event.category && (
                    <span className="event-category">{event.category}</span>
                  )}
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-details">
                  <p className="event-location">📍 {event.location}</p>
                  <p className="event-date">📅 {format(new Date(event.date), 'PPP p')}</p>
                  <p className="event-organizer">👤 {event.organizer_name}</p>
                  {event.price > 0 && (
                    <p className="event-price">💰 ${event.price}</p>
                  )}
                </div>
                
                {user && user.role === 'attendee' && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleRegister(event.id)}
                  >
                    {event.price > 0 ? `Register - $${event.price}` : 'Register Free'}
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="no-events">
              <div className="empty-state">
                <div className="empty-icon">🎉</div>
                <h3>No Events Found</h3>
                <p>No events match your current filters. Try adjusting your search criteria.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {showPayment && paymentEvent && (
        <div className="payment-modal">
          <div className="payment-overlay" onClick={() => setShowPayment(false)}></div>
          <PaymentForm 
            event={paymentEvent}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      )}
    </div>
  );
};

export default Events;