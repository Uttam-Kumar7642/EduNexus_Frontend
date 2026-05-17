import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, Star, MapPin, CheckCircle, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000/api';
const CATEGORIES = ['All','Engineering','Management','Medical','Law','Arts','Science','Commerce','Design'];
const MODES = ['All','Online','Offline','Hybrid'];

const CARD_COLORS = [
  { bg: 'linear-gradient(135deg,#1e3a5f,#2d5a8e)', accent: '#60a5fa', light: 'rgba(96,165,250,0.15)' },
  { bg: 'linear-gradient(135deg,#1a3a2e,#2d5a47)', accent: '#4ade80', light: 'rgba(74,222,128,0.15)' },
  { bg: 'linear-gradient(135deg,#3d1f5c,#6b3fa0)', accent: '#c084fc', light: 'rgba(192,132,252,0.15)' },
  { bg: 'linear-gradient(135deg,#5c1f1f,#9b3a3a)', accent: '#f87171', light: 'rgba(248,113,113,0.15)' },
  { bg: 'linear-gradient(135deg,#3d2e0e,#7a5c1e)', accent: '#fbbf24', light: 'rgba(251,191,36,0.15)' },
  { bg: 'linear-gradient(135deg,#1e3a4f,#1e5f6b)', accent: '#22d3ee', light: 'rgba(34,211,238,0.15)' },
];

function EnquiryModal({ college, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', courseInterest: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return toast.error('Name, email and phone required.');
    setLoading(true);
    try {
      const res = await fetch(`${API}/leads`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, collegeName: college.name, source: 'college-enquiry' })
      });
      const data = await res.json();
      if (data.success) { setDone(true); toast.success('Enquiry sent successfully!'); }
      else toast.error(data.message);
    } catch { toast.error('Failed. Try again.'); }
    finally { setLoading(false); }
  };

  const inp = { width: '100%', padding: '11px 14px', border: '1px solid #1a3a7a', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#061428', color: '#fff' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#0d1f3c', border: '1px solid #1a3a7a', borderRadius: 20, width: '100%', maxWidth: 460, padding: 32, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: '#1a3a7a', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><X size={16} /></button>
        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
            <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Enquiry Sent!</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>Expert from <strong style={{ color: '#f59e0b' }}>{college.name}</strong> will contact you within 24 hours.</p>
            <button onClick={onClose} style={{ padding: '10px 24px', background: '#f59e0b', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Close</button>
          </div>
        ) : (
          <>
            <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Enquire Now</h3>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 20 }}>Sending enquiry to <strong style={{ color: '#f59e0b' }}>{college.name}</strong></p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input style={inp} placeholder="Full Name *" value={form.name} onChange={set('name')} />
              <input style={inp} type="email" autoComplete="email" placeholder="Email Address *" value={form.email} onChange={set('email')} />
              <input style={inp} type="tel" placeholder="Phone Number *" value={form.phone} onChange={set('phone')} />
              <select style={{ ...inp, cursor: 'pointer' }} value={form.courseInterest} onChange={set('courseInterest')}>
                <option value="">Select Program Interest</option>
                {college.programs?.map(p => <option key={p.name} value={p.name}>{p.name} — ₹{p.fees?.toLocaleString()}</option>)}
              </select>
              <button type="submit" disabled={loading} style={{ padding: '13px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 10, color: '#000', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Sending...' : 'Send Enquiry →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function Colleges() {
  const [searchParams] = useSearchParams();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('All');
  const [mode, setMode] = useState(searchParams.get('mode') || 'All');
  const [enquiryCollege, setEnquiryCollege] = useState(null);

  useEffect(() => {
    setLoading(true);
    let url = `${API}/colleges?limit=30`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category !== 'All') url += `&category=${encodeURIComponent(category)}`;
    if (mode !== 'All') url += `&mode=${encodeURIComponent(mode)}`;
    fetch(url)
      .then(r => r.json())
      .then(d => setColleges(d.colleges || []))
      .catch(() => setColleges([]))
      .finally(() => setLoading(false));
  }, [search, category, mode]);

  return (
    <div style={{ minHeight: '100vh', background: '#040d1a', paddingTop: 80, paddingBottom: 60 }}>
      {enquiryCollege && <EnquiryModal college={enquiryCollege} onClose={() => setEnquiryCollege(null)} />}

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a7a)', borderRadius: 20, padding: '40px 36px', marginBottom: 32 }}>
          <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Top Universities & Colleges in India</h1>
          <p style={{ color: '#94a3b8', marginBottom: 24 }}>Search from {colleges.length}+ colleges — compare fees, courses, placements</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', borderRadius: 10, padding: '12px 16px' }}>
              <Search size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search IIT, Amity, LPU, MBA colleges..." style={{ background: 'none', border: 'none', outline: 'none', fontSize: 15, color: '#1e293b', width: '100%' }} />
              {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={14} style={{ color: '#94a3b8' }} /></button>}
            </div>
            <select value={mode} onChange={e => setMode(e.target.value)} style={{ padding: '12px 16px', borderRadius: 10, border: 'none', fontSize: 14, background: '#fff', color: '#1e293b', cursor: 'pointer' }}>
              {MODES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{ padding: '8px 16px', borderRadius: 100, cursor: 'pointer', fontSize: 13, fontWeight: 600, background: category === cat ? '#f59e0b' : '#0d1f3c', color: category === cat ? '#000' : '#8899aa', border: `1px solid ${category === cat ? '#f59e0b' : '#1a3a7a'}`, transition: 'all 0.2s' }}>
              {cat}
            </button>
          ))}
        </div>

        <p style={{ color: '#8899aa', fontSize: 14, marginBottom: 24 }}>{loading ? 'Loading...' : `${colleges.length} colleges found`}</p>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <div style={{ width: 40, height: 40, border: '3px solid #1a3a7a', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : colleges.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#8899aa' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏛️</div>
            <h3 style={{ color: '#ccd6f6' }}>No colleges found</h3>
            <button onClick={() => { setSearch(''); setCategory('All'); setMode('All'); }} style={{ marginTop: 16, padding: '10px 24px', background: '#f59e0b', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Clear Filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {colleges.map((college, idx) => {
              const color = CARD_COLORS[idx % CARD_COLORS.length];
              return (
                <div key={college._id} style={{ background: '#0d1f3c', border: '1px solid #1a3a7a', borderRadius: 20, overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex', flexDirection: 'column' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.4)`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>

                  {/* Card header with color */}
                  <div style={{ background: color.bg, padding: '24px 20px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                    <div style={{ position: 'absolute', bottom: -30, right: 20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative', zIndex: 1 }}>
                      <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff', flexShrink: 0, border: `2px solid ${color.accent}40` }}>
                        {college.name.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 4, lineHeight: 1.3 }}>{college.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                          <MapPin size={12} />{college.location?.city}, {college.location?.state}
                        </div>
                      </div>
                    </div>
                    {/* Accreditations */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12, position: 'relative', zIndex: 1 }}>
                      {college.accreditation?.slice(0, 3).map(a => (
                        <span key={a} style={{ fontSize: 10, background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 4, padding: '2px 8px', fontWeight: 600 }}>{a}</span>
                      ))}
                      <span style={{ fontSize: 10, background: color.light, color: color.accent, borderRadius: 4, padding: '2px 8px', fontWeight: 600, border: `1px solid ${color.accent}40` }}>{college.mode}</span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Rating & Students */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Star size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                        <strong style={{ color: '#fff', fontSize: 14 }}>{college.rating}</strong>
                        <span style={{ color: '#8899aa', fontSize: 12 }}>({college.totalRatings?.toLocaleString()})</span>
                      </div>
                      <span style={{ color: '#8899aa', fontSize: 12 }}>{college.totalStudents?.toLocaleString()}+ students</span>
                    </div>

                    {/* Programs */}
                    <div>
                      <p style={{ color: '#8899aa', fontSize: 12, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Programs & Fees</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {college.programs?.slice(0, 3).map(p => (
                          <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid #1a3a7a', borderRadius: 8, padding: '8px 12px' }}>
                            <div>
                              <div style={{ color: '#ccd6f6', fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                              <div style={{ color: '#8899aa', fontSize: 11 }}>{p.duration}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ color: color.accent, fontWeight: 700, fontSize: 14 }}>₹{(p.fees / 1000).toFixed(0)}K</div>
                              <div style={{ display: 'flex', gap: 4 }}>
                                {p.emiAvailable && <span style={{ fontSize: 9, background: 'rgba(59,130,246,0.2)', color: '#60a5fa', borderRadius: 3, padding: '1px 4px' }}>EMI</span>}
                                {p.ugcApproved && <span style={{ fontSize: 9, background: 'rgba(34,197,94,0.2)', color: '#4ade80', borderRadius: 3, padding: '1px 4px' }}>UGC</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Placement */}
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ flex: 1, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                        <div style={{ color: '#4ade80', fontWeight: 700, fontSize: 15 }}>{college.placementRate}%</div>
                        <div style={{ color: '#8899aa', fontSize: 11 }}>Placement</div>
                      </div>
                      <div style={{ flex: 1, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                        <div style={{ color: '#60a5fa', fontWeight: 700, fontSize: 15 }}>{college.averagePackage}</div>
                        <div style={{ color: '#8899aa', fontSize: 11 }}>Avg Package</div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                      <Link to={`/college/${college._id}`} style={{ flex: 1 }}>
                        <button style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid #1a3a7a', borderRadius: 10, color: '#ccd6f6', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>View Details</button>
                      </Link>
                      <Link to="/compare-courses" style={{ flex: 1 }}>
                        <button style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid #1a3a7a', borderRadius: 10, color: '#ccd6f6', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Compare</button>
                      </Link>
                      <button onClick={() => setEnquiryCollege(college)} style={{ flex: 1, padding: '10px', background: `linear-gradient(135deg,${color.accent},${color.accent}cc)`, border: 'none', borderRadius: 10, color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Enquire</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
