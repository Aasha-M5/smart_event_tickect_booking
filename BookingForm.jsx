import React, { useState } from 'react';
import { Ticket, AlertCircle } from 'lucide-react';
import api from '../api';
import { formatCurrency } from '../utils/currency';

const BookingForm = ({ event, user, onSuccess }) => {
  const [tickets, setTickets] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const totalAmount = tickets * event.ticket_price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tickets <= 0) {
      setError("Please enter a positive number of tickets.");
      return;
    }
    if (tickets > event.available_tickets) {
      setError(`Only ${event.available_tickets} tickets available.`);
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const payload = {
        user_id: user.id,
        event_id: event.id,
        number_of_tickets: tickets,
        total_amount: totalAmount
      };

      const res = await api.post('book.php', payload);
      
      if (res.data.status === 'success') {
        onSuccess({
          booking_id: res.data.booking_id,
          event_name: event.name,
          user_name: user.name,
          tickets: tickets,
          total: totalAmount
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-container animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <h2 className="gradient-text mb-4">Book Tickets</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input type="text" className="form-input" value={user.name} disabled />
        </div>

        <div className="form-group">
          <label className="form-label">Email ID</label>
          <input type="email" className="form-input" value={user.email} disabled />
        </div>

        <div className="form-group">
          <label className="form-label">Department</label>
          <input type="text" className="form-input" value={user.department} disabled />
        </div>

        <div className="form-group">
          <label className="form-label">Number of Tickets</label>
          <input 
            type="number" 
            className="form-input" 
            value={tickets}
            onChange={(e) => {
              setTickets(parseInt(e.target.value) || '');
              setError('');
            }}
            min="1"
            max={event.available_tickets}
            required 
          />
          <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Max available: {event.available_tickets}</p>
        </div>

        <div className="glass-card mb-4" style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)' }}>
          <div className="flex justify-between items-center">
            <span style={{ fontWeight: '500' }}>Total Amount</span>
            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        {error && (
          <div className="error-message mb-4">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          <Ticket size={18} />
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
