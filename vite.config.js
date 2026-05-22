import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['.ngrok-free.dev', '.loca.lt'],
    host: true,
    proxy: {
      '/smart_ticket_booking/api': {
        target: 'http://localhost',
        changeOrigin: true
      }
    }
  }
})
