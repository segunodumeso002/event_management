import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../components/AlertProvider';
import { registrationAPI } from '../services/api';

const Attendees = ({ user, token }) => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!user || !token || user.role !== 'organizer') {
      navigate('/');
      return;
    }
    fetchAttendees();
  }, [user, token, navigate]);

  const fetchAttendees = async () => {
    try {
      const response = await registrationAPI.getOrganizerAttendees(token);
      setAttendees(response.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch attendees:', err);
      setAttendees([]);
      showAlert('Failed to fetch attendees', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="events-container">
      <h1>Event Attendees</h1>
      
      {!attendees || attendees.length === 0 ? (
        <div className="no-events">
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No Attendees Yet</h3>
            <p>When people register for your events, their details will appear here.</p>
            <div className="empty-tips">
              <h4>💡 Tips to get more attendees:</h4>
              <ul>
                <li>Share your event links on social media</li>
                <li>Make sure your event details are clear and engaging</li>
                <li>Set reasonable dates and locations</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="attendees-grid">
          {attendees && Array.isArray(attendees) && attendees.map(registration => (
            <div key={registration.id} className="glass-card attendee-card">
              <div className="attendee-header">
                <h3>{registration.user.firstname} {registration.user.lastname}</h3>
                <span className="registration-badge">📝 Registered</span>
              </div>
              
              <div className="attendee-details">
                <p><strong>📧 Email:</strong> {registration.user.email}</p>
                <p><strong>🎪 Event:</strong> {registration.event.title}</p>
                <p><strong>📅 Event Date:</strong> {new Date(registration.event.date).toLocaleDateString()}</p>
                <p><strong>📍 Location:</strong> {registration.event.location}</p>
                <p><strong>✅ Registered On:</strong> {new Date(registration.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Attendees;