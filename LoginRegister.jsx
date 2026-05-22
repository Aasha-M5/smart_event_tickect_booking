import React, { useState } from 'react';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import api from '../api';

const LoginRegister = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await api.post('login.php', { email: formData.email, password: formData.password });
        if (res.data.status === 'success') {
          onLogin(res.data.user);
        }
      } else {
        const res = await api.post('register.php', formData);
        if (res.data.status === 'success') {
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '', department: '' });
          alert('Registration successful! Please login.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-container animate-fade-in" style={{ maxWidth: '550px', margin: '6rem auto', padding: '3rem 2.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p style={{ marginTop: '0.5rem' }}>Enter your credentials to access the portal</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-input" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
          </div>
        )}
        
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" name="email" className="form-input" placeholder="john@university.edu" value={formData.email} onChange={handleChange} required />
        </div>
        
        {!isLogin && (
          <div className="form-group">
            <label className="form-label">Department</label>
            <input type="text" name="department" className="form-input" placeholder="Computer Science" value={formData.department} onChange={handleChange} required />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-input" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
        </div>

        {error && (
          <div className="error-message mb-4">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {isLogin ? <><LogIn size={18} /> Login</> : <><UserPlus size={18} /> Register</>}
        </button>
      </form>

      <p className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}>
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default LoginRegister;
