import React, { useRef } from 'react';
import { CheckCircle, Download, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import { formatCurrency } from '../utils/currency';

const BookingSummary = ({ booking, onReset }) => {
  const ticketRef = useRef(null);

  // Generate a QR code URL using QuickChart API
  const qrData = JSON.stringify({
    ID: booking.booking_id,
    Event: booking.event_name,
    User: booking.user_name,
    Tickets: booking.tickets
  });
  const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrData)}&size=200&margin=2`;

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2, // Higher quality
        backgroundColor: '#ffffff'
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Ticket_${booking.event_name.replace(/\s+/g, '_')}_#${booking.booking_id}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to generate ticket image", err);
      alert("Failed to download ticket. Please try again.");
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <CheckCircle size={64} color="var(--success)" />
      </div>
      
      <h2 className="gradient-text mb-2">Booking Confirmed!</h2>
      <p className="mb-6">Your tickets have been successfully booked. Have a great time!</p>

      {/* This is the element we will capture as an image */}
      <div 
        ref={ticketRef} 
        className="glass-card mb-6" 
        style={{ textAlign: 'left', background: 'var(--card-bg)', padding: '2rem', border: '1px solid var(--card-border)', borderRadius: '12px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--card-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--primary)' }}>Smart Tickets</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Official Entry Pass</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Booking ID</p>
            <p style={{ fontWeight: '700', fontSize: '1.25rem', margin: 0 }}>#{booking.booking_id.toString().padStart(6, '0')}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Event Name</p>
            <p style={{ fontWeight: '600', fontSize: '1.125rem', margin: 0 }}>{booking.event_name}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Attendee Name</p>
            <p style={{ fontWeight: '600', fontSize: '1.125rem', margin: 0 }}>{booking.user_name}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Total Tickets Valid</p>
            <p style={{ fontWeight: '600', fontSize: '1.125rem', margin: 0 }}>{booking.tickets}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Total Amount Paid</p>
            <p style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--success)', margin: 0 }}>
              {formatCurrency(booking.total)}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
          <div style={{ textAlign: 'center' }}>
            <img src={qrCodeUrl} alt="Booking QR Code" style={{ width: '150px', height: '150px', borderRadius: '8px' }} />
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', margin: 0 }}>Scan at entrance</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={handleDownload} className="btn btn-primary">
          <Download size={18} /> Download Ticket PNG
        </button>
        <button onClick={onReset} className="btn btn-secondary">
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;
