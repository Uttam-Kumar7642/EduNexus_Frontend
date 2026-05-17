import { useState, useRef, useEffect } from 'react';

const DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'rediffmail.com', 'ymail.com', 'protonmail.com'];

export default function EmailInput({ value, onChange, className, style, placeholder = 'you@example.com', ...props }) {
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setShow(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(e);
    if (val.includes('@')) {
      const [local, partial] = val.split('@');
      const matches = DOMAINS.filter(d => d.startsWith(partial || '')).map(d => `${local}@${d}`);
      setSuggestions(matches);
      setShow(matches.length > 0);
    } else if (val.length > 0) {
      setSuggestions(DOMAINS.map(d => `${val}@${d}`));
      setShow(true);
    } else {
      setShow(false);
    }
  };

  const select = (email) => {
    onChange({ target: { value: email } });
    setShow(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <input
        type="email"
        autoComplete="email"
        value={value}
        onChange={handleChange}
        onFocus={() => value && setShow(suggestions.length > 0)}
        className={className}
        style={style}
        placeholder={placeholder}
        {...props}
      />
      {show && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 9999,
          background: '#0d1f3c', border: '1px solid #1a3a7a', borderRadius: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)', marginTop: 4, overflow: 'hidden'
        }}>
          {suggestions.slice(0, 6).map(email => (
            <div key={email} onClick={() => select(email)} style={{
              padding: '10px 16px', cursor: 'pointer', fontSize: 14, color: '#ccd6f6',
              display: 'flex', alignItems: 'center', gap: 10,
              borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#1a3a7a'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 16 }}>✉️</span>
              <span>{email}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
