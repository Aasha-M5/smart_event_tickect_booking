import React from 'react';
import { Calendar, MapPin, Building, Ticket as TicketIcon, Users } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const EventDetails = ({ event }) => {
  return (
    <div className="glass-container animate-fade-in">
      <h2 className="gradient-text mb-4">Event Details</h2>
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ margin: 0 }}>{event.name}</h3>
        <span className="badge">{event.department}</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div className="glass-card flex items-center gap-4">
          <Calendar color="var(--primary)" size={24} />
          <div>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Date & Time</p>
            <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: '600' }}>
              {new Date(event.date_time).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4">
          <MapPin color="var(--secondary)" size={24} />
          <div>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Venue</p>
            <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: '600' }}>
              {event.venue}
            </p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4">
          <TicketIcon color="#10b981" size={24} />
          <div>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Ticket Price</p>
            <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: '600' }}>
              {formatCurrency(event.ticket_price)}
            </p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4">
          <Users color="#f59e0b" size={24} />
          <div>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Availability</p>
            <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: '600' }}>
              {event.available_tickets} / {event.total_tickets} Tickets Left
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
