import React, { useState, useEffect } from 'react';
import { Users, Ticket, DollarSign, Calendar, PlusCircle, LayoutDashboard, Edit, Trash2 } from 'lucide-react';
import api from '../api';
import { formatCurrency } from '../utils/currency';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    name: '', department: '', date_time: '', venue: '', ticket_price: '', total_tickets: '', available_tickets: ''
  });
  const [formMsg, setFormMsg] = useState({ text: '', type: '' });

  const fetchData = async () => {
    try {
      const [statsRes, eventsRes] = await Promise.all([
        api.get('admin_stats.php'),
        api.get('events.php')
      ]);
      
      if (statsRes.data.status === 'success') setStats(statsRes.data.data);
      if (eventsRes.data.status === 'success') setEvents(eventsRes.data.data);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setFormMsg({ text: editingEvent ? 'Updating event...' : 'Creating event...', type: 'info' });
    try {
      if (editingEvent) {
        const payload = { ...eventForm, id: editingEvent.id };
        const res = await api.post('update_event.php', payload);
        if (res.data.status === 'success') {
          setFormMsg({ text: 'Event updated successfully!', type: 'success' });
          setEditingEvent(null);
          setShowAddEvent(false);
        }
      } else {
        const res = await api.post('add_event.php', eventForm);
        if (res.data.status === 'success') {
          setFormMsg({ text: 'Event created successfully!', type: 'success' });
          setShowAddEvent(false);
        }
      }
      fetchData(); // Refresh data
    } catch (err) {
      setFormMsg({ text: err.response?.data?.message || 'Error saving event', type: 'error' });
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event? This will also delete all associated bookings.")) {
      try {
        const res = await api.post('delete_event.php', { id });
        if (res.data.status === 'success') {
          alert('Event deleted successfully.');
          fetchData();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting event.');
      }
    }
  };

  const openEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      name: event.name,
      department: event.department,
      date_time: event.date_time.replace(" ", "T"), // Format for datetime-local
      venue: event.venue,
      ticket_price: event.ticket_price,
      total_tickets: event.total_tickets,
      available_tickets: event.available_tickets
    });
    setShowAddEvent(true);
    setFormMsg({ text: '', type: '' });
  };

  const openAddEvent = () => {
    setEditingEvent(null);
    setEventForm({ name: '', department: '', date_time: '', venue: '', ticket_price: '', total_tickets: '' });
    setShowAddEvent(true);
    setFormMsg({ text: '', type: '' });
  };

  if (loading) return <div className="text-center mt-4">Loading Admin Dashboard...</div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="gradient-text mb-2" style={{ fontSize: '2.5rem' }}>Welcome, {user.name}!</h1>
        <div className="flex justify-between items-center">
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: '500' }}>
            <LayoutDashboard size={22} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
            System Administration
          </h2>
          {!showAddEvent && (
            <button className="btn btn-primary" onClick={openAddEvent}>
              <PlusCircle size={18} /> Add New Event
            </button>
          )}
        </div>
      </div>

      {showAddEvent ? (
        <div className="glass-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 style={{ margin: 0 }}>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
            <button className="btn btn-secondary" onClick={() => setShowAddEvent(false)}>Cancel</button>
          </div>
          <form onSubmit={handleEventSubmit}>
            <div className="form-group">
              <label className="form-label">Event Name</label>
              <input type="text" className="form-input" required value={eventForm.name} onChange={e => setEventForm({...eventForm, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input type="text" className="form-input" required value={eventForm.department} onChange={e => setEventForm({...eventForm, department: e.target.value})} />
            </div>
            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Date & Time</label>
                <input type="datetime-local" className="form-input" required value={eventForm.date_time} onChange={e => setEventForm({...eventForm, date_time: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Venue</label>
                <input type="text" className="form-input" required value={eventForm.venue} onChange={e => setEventForm({...eventForm, venue: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Ticket Price (₹)</label>
                <input type="number" step="0.01" className="form-input" required value={eventForm.ticket_price} onChange={e => setEventForm({...eventForm, ticket_price: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Total Tickets</label>
                <input type="number" className="form-input" required value={eventForm.total_tickets} onChange={e => setEventForm({...eventForm, total_tickets: e.target.value})} />
              </div>
            </div>
            
            {editingEvent && (
              <div className="form-group">
                <label className="form-label">Available Tickets</label>
                <input type="number" className="form-input" required value={eventForm.available_tickets} onChange={e => setEventForm({...eventForm, available_tickets: e.target.value})} />
                <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Modify only if manually adjusting inventory.</p>
              </div>
            )}
            
            {formMsg.text && (
              <div className={formMsg.type === 'error' ? 'error-message mb-4' : 'success-message mb-4'}>
                {formMsg.text}
              </div>
            )}
            
            <button type="submit" className="btn btn-primary w-100" style={{ width: '100%' }}>
              {editingEvent ? 'Save Changes' : 'Create Event'}
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 mb-8">
            <div className="glass-card flex items-center gap-4">
              <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                <DollarSign color="#10b981" size={32} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>Total Revenue</p>
                <h2 style={{ margin: 0 }}>{formatCurrency(stats?.total_revenue || 0)}</h2>
              </div>
            </div>

            <div className="glass-card flex items-center gap-4">
              <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}>
                <Ticket color="#8b5cf6" size={32} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>Tickets Sold</p>
                <h2 style={{ margin: 0 }}>{stats?.total_tickets_sold || 0}</h2>
              </div>
            </div>

            <div className="glass-card flex items-center gap-4">
              <div style={{ padding: '1rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px' }}>
                <Calendar color="#ec4899" size={32} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>Active Events</p>
                <h2 style={{ margin: 0 }}>{stats?.total_events || 0}</h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1" style={{ gap: '2rem' }}>
            {/* Events Management */}
            <div className="glass-container">
              <h2 className="mb-4">Manage Events</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <th style={{ padding: '1rem' }}>Event Name</th>
                      <th style={{ padding: '1rem' }}>Date</th>
                      <th style={{ padding: '1rem' }}>Price</th>
                      <th style={{ padding: '1rem' }}>Available</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(event => (
                      <tr key={event.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: '600' }}>{event.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{event.department}</div>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{new Date(event.date_time).toLocaleString()}</td>
                        <td style={{ padding: '1rem' }}>{formatCurrency(event.ticket_price)}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ color: event.available_tickets > 0 ? 'var(--success)' : 'var(--error)' }}>
                            {event.available_tickets} / {event.total_tickets}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <button 
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginRight: '1rem' }}
                            onClick={() => openEditEvent(event)}
                            title="Edit Event"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                            onClick={() => handleDeleteEvent(event.id)}
                            title="Delete Event"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {events.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center" style={{ padding: '2rem' }}>No events found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="glass-container">
              <h2 className="mb-4">Recent Bookings</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <th style={{ padding: '1rem' }}>ID</th>
                      <th style={{ padding: '1rem' }}>User</th>
                      <th style={{ padding: '1rem' }}>Event</th>
                      <th style={{ padding: '1rem' }}>Tickets</th>
                      <th style={{ padding: '1rem' }}>Amount</th>
                      <th style={{ padding: '1rem' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recent_bookings.map(booking => (
                      <tr key={booking.booking_id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <td style={{ padding: '1rem' }}>#{booking.booking_id}</td>
                        <td style={{ padding: '1rem' }}>
                          <div>{booking.user_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.user_email}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>{booking.event_name}</td>
                        <td style={{ padding: '1rem' }}>{booking.number_of_tickets}</td>
                        <td style={{ padding: '1rem', color: 'var(--success)' }}>{formatCurrency(booking.total_amount)}</td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{new Date(booking.booking_date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {(!stats?.recent_bookings || stats.recent_bookings.length === 0) && (
                      <tr>
                        <td colSpan="6" className="text-center" style={{ padding: '2rem' }}>No bookings found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
