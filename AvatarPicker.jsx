import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const avatarStyles = [
  "adventurer", "avataaars", "big-ears", "bottts", "croodles", "fun-emoji", "lorelei", "micah", "miniavs", "open-peeps", "personas", "pixel-art"
];

const AvatarPicker = ({ user, onClose, onSelect }) => {
  const [selectedStyle, setSelectedStyle] = useState('avataaars');
  const [seed, setSeed] = useState(user.name.replace(/\s+/g, ''));
  const [loading, setLoading] = useState(false);

  // Generate URL using DiceBear API
  const generateUrl = (style, seedStr) => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seedStr}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  };

  const handleSave = async () => {
    setLoading(true);
    const finalUrl = generateUrl(selectedStyle, seed);
    await onSelect(finalUrl);
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="glass-container animate-fade-in" style={{ width: '90%', maxWidth: '500px', position: 'relative' }}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>
        
        <h2 className="mb-4">Choose Your Avatar</h2>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{ flex: '0 0 120px', textAlign: 'center' }}>
            <img 
              src={generateUrl(selectedStyle, seed)} 
              alt="Preview" 
              style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #e2e8f0', backgroundColor: 'white' }} 
            />
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>Preview</p>
          </div>
          
          <div style={{ flex: 1 }}>
            <div className="form-group mb-2">
              <label className="form-label">Avatar Style</label>
              <select 
                className="form-input" 
                value={selectedStyle} 
                onChange={(e) => setSelectedStyle(e.target.value)}
                style={{ background: '#ffffff' }}
              >
                {avatarStyles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Randomizer Seed (Type anything!)</label>
              <input 
                type="text" 
                className="form-input" 
                value={seed} 
                onChange={(e) => setSeed(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <button className="btn btn-primary w-100" style={{ width: '100%' }} onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : <><Check size={18} /> Save Avatar</>}
        </button>
      </div>
    </div>
  );
};

export default AvatarPicker;
