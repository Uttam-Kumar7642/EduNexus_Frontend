import { useState } from 'react';
import toast from 'react-hot-toast';
import { Phone, Mail, User, BookOpen, MessageSquare, X } from 'lucide-react';

const API = 'https://edunexus-backend-4es3.onrender.com/api';

export default function ExpertForm({ onClose, isModal = false }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', courseInterest: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return toast.error('Name, email and phone are required.');
    setLoading(true);
    try {
      const res = await fetch(`${API}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        toast.success('Thank you! Our expert will call you within 24 hours.');
      } else {
        toast.error(data.message || 'Submission failed.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = { padding: '11px 16px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', color: '#1e293b' };

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: 32 }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
      <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Request Submitted!</h3>
      <p style={{ color: '#64748b', lineHeight: 1.6 }}>Our expert counsellor will contact you within 24 hours.</p>
      {isModal && <button onClick={onClose} style={{ marginTop: 20, padding: '10px 24px', background: '#f59e0b', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Close</button>}
    </div>
  );

  return (
    <div id="lead-form" style={{ background: '#fff', borderRadius: isModal ? 0 : 20, border: isModal ? 'none' : '1px solid #e2e8f0', padding: 32, boxShadow: isModal ? 'none' : '0 8px 32px rgba(0,0,0,0.08)' }}>
      {isModal && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Talk to an Expert</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
        </div>
      )}
      {!isModal && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>Talk to an Expert</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>Get free counselling from our education experts</p>
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ position: 'relative' }}>
          <User size={15} style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8' }} />
          <input style={{ ...inp, paddingLeft: 40 }} placeholder="Full Name *" value={form.name} onChange={set('name')} />
        </div>
        <div style={{ position: 'relative' }}>
          <Mail size={15} style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8' }} />
          <input style={{ ...inp, paddingLeft: 40 }} type="email" autoComplete="email" placeholder="Email Address *" value={form.email} onChange={set('email')} />
        </div>
        <div style={{ position: 'relative' }}>
          <Phone size={15} style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8' }} />
          <input style={{ ...inp, paddingLeft: 40 }} type="tel" placeholder="Phone Number *" value={form.phone} onChange={set('phone')} />
        </div>
        <div style={{ position: 'relative' }}>
          <BookOpen size={15} style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8' }} />
          <select style={{ ...inp, paddingLeft: 40, cursor: 'pointer', color: form.courseInterest ? '#1e293b' : '#94a3b8' }} value={form.courseInterest} onChange={set('courseInterest')}>
            <option value="">Select Course Interest</option>
            {['MBA', 'MCA', 'B.Tech', 'BCA', 'BBA', 'Data Science', 'Digital Marketing', 'Web Development', 'Other'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ position: 'relative' }}>
          <MessageSquare size={15} style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8' }} />
          <textarea style={{ ...inp, paddingLeft: 40, resize: 'vertical', minHeight: 80 }} placeholder="Any specific questions? (optional)" value={form.message} onChange={set('message')} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '13px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 10, color: '#000', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Submitting...' : 'Get Free Counselling →'}
        </button>
        <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>🔒 Your information is 100% secure and confidential</p>
      </form>
    </div>
  );
}
