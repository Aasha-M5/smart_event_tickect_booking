import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: '/smart_ticket_booking/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
