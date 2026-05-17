import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Users, Award, CheckCircle, Phone, Mail, Clock, BookOpen, TrendingUp, Shield, ArrowRight, Building2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const API = 'https://https://edunexus-backend-4es3.onrender.com';

function EnquiryModal({ college, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', courseInterest: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return toast.error('Name, email and phone are required.');
    setLoading(true);
    try {
      const res = await fetch(`${API}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, collegeName: college.name, source: 'college-enquiry' })
      });
      const data = await res.json();
      if (data.success) { setDone(true); toast.success('Enquiry sent! Expert will contact you soon.'); }
      else toast.error(data.message);
    } catch { toast.error('Failed. Try again.'); }
    finally { setLoading(false); }
  };

  const inp = { width: '100%', padding: '11px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', color: '#1e293b' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, padding: 32, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} /></button>

        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Enquiry Submitted!</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>Our counsellor from <strong>{college.name}</strong> will contact you within 24 hours.</p>
            <button onClick={onClose} style={{ padding: '10px 24px', background: '#f59e0b', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Enquire Now</h3>
              <p style={{ color: '#64748b', fontSize: 13 }}>Send enquiry to <strong style={{ color: '#0d2045' }}>{college.name}</strong></p>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input style={inp} placeholder="Full Name *" value={form.name} onChange={set('name')} />
              <input style={inp} type="email" autoComplete="email" placeholder="Email Address *" value={form.email} onChange={set('email')} />
              <input style={inp} type="tel" placeholder="Phone Number *" value={form.phone} onChange={set('phone')} />
              <select style={{ ...inp, cursor: 'pointer', color: form.courseInterest ? '#1e293b' : '#94a3b8' }} value={form.courseInterest} onChange={set('courseInterest')}>
                <option value="">Select Program Interest</option>
                {college.programs?.map(p => <option key={p.name} value={p.name}>{p.name} — ₹{p.fees?.toLocaleString()}</option>)}
              </select>
              <textarea style={{ ...inp, resize: 'vertical', minHeight: 80 }} placeholder="Any specific questions? (optional)" value={form.message} onChange={set('message')} />
              <button type="submit" disabled={loading} style={{ padding: '13px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 10, color: '#000', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Sending...' : 'Send Enquiry →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function CollegeDetails() {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetch(`${API}/colleges/${id}`)
      .then(r => r.json())
      .then(d => setCollege(d.college))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
      <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!college) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
      <h2 style={{ color: '#1e293b' }}>College not found</h2>
      <Link to="/colleges"><button style={{ marginTop: 16, padding: '10px 24px', background: '#f59e0b', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Back to Colleges</button></Link>
    </div>
  );

  const tabs = ['overview', 'programs', 'placements', 'recruiters'];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 68 }}>
      {showEnquiry && <EnquiryModal college={college} onClose={() => setShowEnquiry(false)} />}

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg,#0a1628 0%,#0d2045 50%,#1a3a7a 100%)', padding: '48px 0 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <Link to="/colleges" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 13, marginBottom: 24, textDecoration: 'none' }}>← Back to Colleges</Link>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'flex-start', paddingBottom: 32 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: '#000', flexShrink: 0 }}>
                {college.name.charAt(0)}
              </div>
              <div>
                <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, marginBottom: 8 }}>{college.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94a3b8', fontSize: 14 }}><MapPin size={14} />{college.location?.city}, {college.location?.state}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#f59e0b', fontSize: 14 }}><Star size={14} style={{ fill: '#f59e0b' }} />{college.rating} ({college.totalRatings?.toLocaleString()} reviews)</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94a3b8', fontSize: 14 }}><Users size={14} />{college.totalStudents?.toLocaleString()}+ students</span>
                  {college.established && <span style={{ color: '#94a3b8', fontSize: 14 }}>Est. {college.established}</span>}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {college.accreditation?.map(a => (
                    <span key={a} style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{a}</span>
                  ))}
                  <span style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{college.mode}</span>
                  <span style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{college.type}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 160 }}>
              <button onClick={() => setShowEnquiry(true)} style={{ padding: '13px 24px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 12, color: '#000', fontWeight: 700, fontSize: 15, cursor: 'pointer', whiteSpace: 'nowrap' }}>Enquire Now</button>
              <Link to="/compare-courses">
                <button style={{ width: '100%', padding: '12px 24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Compare</button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '14px 24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: activeTab === tab ? '#f59e0b' : '#94a3b8', borderBottom: activeTab === tab ? '2px solid #f59e0b' : '2px solid transparent', transition: 'all 0.2s', textTransform: 'capitalize' }}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'flex-start' }}>

          {/* Main content */}
          <div>
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Quick stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
                  {[
                    { label: 'Placement Rate', value: `${college.placementRate}%`, color: '#22c55e', bg: '#dcfce7' },
                    { label: 'Avg Package', value: college.averagePackage, color: '#3b82f6', bg: '#dbeafe' },
                    { label: 'Total Students', value: college.totalStudents?.toLocaleString() + '+', color: '#f59e0b', bg: '#fef3c7' },
                    { label: 'Programs', value: college.programs?.length + '+', color: '#8b5cf6', bg: '#ede9fe' },
                  ].map(s => (
                    <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: 20, textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* About */}
                <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0' }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}><BookOpen size={18} color="#f59e0b" /> About {college.name}</h2>
                  <p style={{ color: '#475569', lineHeight: 1.8, fontSize: 15 }}>{college.description}</p>
                  {college.established && <p style={{ color: '#64748b', fontSize: 14, marginTop: 12 }}>Established in <strong>{college.established}</strong>, the institution has been shaping careers for over {new Date().getFullYear() - college.established} years.</p>}
                </div>

                {/* Accreditations */}
                {college.accreditation?.length > 0 && (
                  <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}><Shield size={18} color="#f59e0b" /> Accreditations & Approvals</h2>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {college.accreditation.map(a => (
                        <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 16px' }}>
                          <CheckCircle size={16} color="#16a34a" />
                          <span style={{ fontWeight: 600, color: '#166534', fontSize: 14 }}>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'programs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Available Programs</h2>
                {college.programs?.map((p, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>{p.name}</h3>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 14, color: '#64748b', marginBottom: 12 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {p.duration}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={14} /> {college.mode}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {p.ugcApproved && <span style={{ fontSize: 12, background: '#dcfce7', color: '#166534', borderRadius: 6, padding: '3px 10px', fontWeight: 600 }}>✓ UGC Approved</span>}
                        {p.emiAvailable && <span style={{ fontSize: 12, background: '#dbeafe', color: '#1d4ed8', borderRadius: 6, padding: '3px 10px', fontWeight: 600 }}>✓ EMI Available</span>}
                        {p.placementSupport && <span style={{ fontSize: 12, background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '3px 10px', fontWeight: 600 }}>✓ Placement Support</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: '#0d2045', marginBottom: 4 }}>₹{p.fees?.toLocaleString()}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>Total Fees</div>
                      <button onClick={() => setShowEnquiry(true)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 8, color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>Apply Now</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'placements' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Placement Statistics</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                  {[
                    { label: 'Placement Rate', value: `${college.placementRate}%`, color: '#22c55e' },
                    { label: 'Average Package', value: college.averagePackage, color: '#3b82f6' },
                    { label: 'Highest Package', value: '45 LPA', color: '#f59e0b' },
                    { label: 'Companies Visited', value: '200+', color: '#8b5cf6' },
                  ].map(s => (
                    <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, textAlign: 'center' }}>
                      <div style={{ fontSize: 26, fontWeight: 800, color: s.color, marginBottom: 6 }}>{s.value}</div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'recruiters' && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>Top Recruiters</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
                  {college.topRecruiters?.map(r => (
                    <div key={r} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 12px', textAlign: 'center', fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{r}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Enquiry card */}
            <div style={{ background: 'linear-gradient(135deg,#0a1628,#0d2045)', borderRadius: 16, padding: 24, color: '#fff' }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Interested in {college.name}?</h3>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>Get free counselling from our expert. We'll help you with admission process.</p>
              <button onClick={() => setShowEnquiry(true)} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 10, color: '#000', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 10 }}>Enquire Now</button>
              <Link to="/compare-courses" style={{ display: 'block' }}>
                <button style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Compare with Others</button>
              </Link>
            </div>

            {/* Quick info */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Quick Info</h3>
              {[
                ['📍 Location', `${college.location?.city}, ${college.location?.state}`],
                ['🏛️ Type', college.type],
                ['🎓 Mode', college.mode],
                ['📅 Established', college.established],
                ['⭐ Rating', `${college.rating}/5`],
                ['👥 Students', college.totalStudents?.toLocaleString() + '+'],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                  <span style={{ color: '#64748b' }}>{label}</span>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
