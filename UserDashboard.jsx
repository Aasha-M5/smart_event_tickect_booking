import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Ticket as TicketIcon } from 'lucide-react';
import api from '../api';
import EventDetails from './EventDetails';
import BookingForm from './BookingForm';
import BookingSummary from './BookingSummary';
import { formatCurrency } from '../utils/currency';

const UserDashboard = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'history'

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        api.get('events.php'),
        api.get(`user_bookings.php?user_id=${user.id}`)
      ]);
      
      if (eventsRes.data.status === 'success') {
        setEvents(eventsRes.data.data);
      }
      if (bookingsRes.data.status === 'success') {
        setMyBookings(bookingsRes.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookingSuccess = (bookingData) => {
    setBookingConfirmed(bookingData);
    fetchData(); // Refresh available tickets and my bookings
  };

  const handleReset = () => {
    setSelectedEvent(null);
    setBookingConfirmed(null);
  };

  if (loading) return <div className="text-center mt-4">Loading dashboard...</div>;

  if (bookingConfirmed) {
    return <BookingSummary booking={bookingConfirmed} onReset={handleReset} />;
  }

  if (selectedEvent) {
    return (
      <div className="grid grid-cols-1" style={{ gap: '2rem' }}>
        <button onClick={() => setSelectedEvent(null)} className="btn btn-secondary" style={{ width: 'fit-content' }}>
          &larr; Back to Events
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2rem' }}>
          <EventDetails event={selectedEvent} />
          <BookingForm event={selectedEvent} user={user} onSuccess={handleBookingSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="gradient-text mb-2" style={{ fontSize: '2.5rem' }}>Welcome, {user.name}!</h1>
        
        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
          <button 
            onClick={() => setActiveTab('events')}
            style={{ 
              background: activeTab === 'events' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'events' ? 'white' : 'var(--text-main)',
              border: 'none',
              padding: '0.5rem 1.25rem',
              borderRadius: '999px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Upcoming Events
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            style={{ 
              background: activeTab === 'history' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'history' ? 'white' : 'var(--text-main)',
              border: 'none',
              padding: '0.5rem 1.25rem',
              borderRadius: '999px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            My Booking History
          </button>
        </div>
      </div>

      {activeTab === 'events' && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '1.5rem' }}>Explore upcoming department events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {events.map((event) => (
              <div key={event.id} className="glass-card flex" style={{ flexDirection: 'column' }}>
                <div className="flex justify-between items-center mb-4">
                  <span className="badge">{event.department}</span>
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                    {event.available_tickets} / {event.total_tickets} Left
                  </span>
                </div>
                <h3>{event.name}</h3>
                
                <div className="mt-4" style={{ flex: 1 }}>
                  <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--text-muted)' }}>
                    <Calendar size={16} />
                    <span style={{ fontSize: '0.875rem' }}>{new Date(event.date_time).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--text-muted)' }}>
                    <MapPin size={16} />
                    <span style={{ fontSize: '0.875rem' }}>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                    <TicketIcon size={16} />
                    <span style={{ fontWeight: '600' }}>{formatCurrency(event.ticket_price)}</span>
                  </div>
                </div>

                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: '1.5rem' }}
                  onClick={() => setSelectedEvent(event)}
                  disabled={event.available_tickets <= 0}
                >
                  {event.available_tickets > 0 ? 'Book Tickets' : 'Sold Out'}
                </button>
              </div>
            ))}
            {events.length === 0 && (
              <div className="glass-card text-center" style={{ gridColumn: '1 / -1' }}>
                No upcoming events at the moment. Check back later!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking History Section */}
      {activeTab === 'history' && (
        <div className="animate-fade-in">
          {myBookings.length > 0 ? (
            <div className="glass-container mt-4">
              <h2 className="mb-4">My Booking History</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <th style={{ padding: '1rem' }}>Booking ID</th>
                      <th style={{ padding: '1rem' }}>Event Name</th>
                      <th style={{ padding: '1rem' }}>Date & Venue</th>
                      <th style={{ padding: '1rem' }}>Tickets</th>
                      <th style={{ padding: '1rem' }}>Total Amount</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBookings.map(booking => (
                      <tr key={booking.booking_id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <td style={{ padding: '1rem' }}>#{booking.booking_id}</td>
                        <td style={{ padding: '1rem', fontWeight: '600' }}>{booking.event_name}</td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontSize: '0.875rem' }}>{new Date(booking.date_time).toLocaleString()}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.venue}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>{booking.number_of_tickets}</td>
                        <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: '600' }}>
                          {formatCurrency(booking.total_amount)}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                            onClick={() => setBookingConfirmed({
                              booking_id: booking.booking_id,
                              event_name: booking.event_name,
                              user_name: user.name,
                              tickets: booking.number_of_tickets,
                              total: booking.total_amount
                            })}
                          >
                            View Ticket
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass-card text-center mt-4">
              <p>You haven't booked any tickets yet. Check out the upcoming events!</p>
              <button className="btn btn-primary mt-4" onClick={() => setActiveTab('events')}>
                Browse Events
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
