import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import LoginRegister from './components/LoginRegister';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import AvatarPicker from './components/AvatarPicker';
import api from './api';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleAvatarUpdate = async (newUrl) => {
    try {
      const res = await api.post('update_avatar_url.php', { id: user.id, avatar_url: newUrl });
      if (res.data.status === 'success') {
        const updatedUser = { ...user, avatar_url: newUrl };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setShowAvatarPicker(false);
      }
    } catch (err) {
      console.error("Failed to update avatar", err);
      alert("Failed to update avatar. Please try again.");
    }
  };

  return (
    <Router>
      <nav className="navbar">
        <div className="flex items-center gap-2">
          <Ticket size={28} color="var(--primary)" />
          <h2 style={{ margin: 0 }} className="gradient-text">Smart Tickets</h2>
          {user && user.role === 'admin' && (
            <span className="badge" style={{ background: 'var(--primary)', color: 'white' }}>Admin</span>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center gap-2" 
              style={{ cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '8px', transition: 'background 0.2s' }}
              onClick={() => setShowAvatarPicker(true)}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              title="Change Profile Picture"
            >
              <img 
                src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b5cf6&color=fff&rounded=true`} 
                alt="Profile Avatar" 
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #e2e8f0', backgroundColor: 'white' }}
              />
              <span style={{ fontWeight: '500' }}>{user.name}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              Logout
            </button>
          </div>
        )}
      </nav>

      <main className="container">
        <Routes>
          <Route 
            path="/" 
            element={!user ? <LoginRegister onLogin={handleLogin} /> : <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} />} 
          />
          <Route 
            path="/dashboard" 
            element={user && user.role !== 'admin' ? <UserDashboard user={user} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin" 
            element={user && user.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/" />} 
          />
        </Routes>
      </main>

      {showAvatarPicker && user && (
        <AvatarPicker 
          user={user} 
          onClose={() => setShowAvatarPicker(false)} 
          onSelect={handleAvatarUpdate} 
        />
      )}
    </Router>
  );
}

export default App;
