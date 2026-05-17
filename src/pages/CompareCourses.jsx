import { useState, useEffect } from 'react';
import { Search, X, CheckCircle, Star, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const API = 'https://edunexus-backend-4es3.onrender.com/api';

const CARD_COLORS = [
  { bg: 'linear-gradient(135deg,#1e3a5f,#2d5a8e)', accent: '#60a5fa' },
  { bg: 'linear-gradient(135deg,#1a3a2e,#2d5a47)', accent: '#4ade80' },
  { bg: 'linear-gradient(135deg,#3d1f5c,#6b3fa0)', accent: '#c084fc' },
  { bg: 'linear-gradient(135deg,#5c1f1f,#9b3a3a)', accent: '#f87171' },
  { bg: 'linear-gradient(135deg,#3d2e0e,#7a5c1e)', accent: '#fbbf24' },
  { bg: 'linear-gradient(135deg,#1e3a4f,#1e5f6b)', accent: '#22d3ee' },
];

const COMPARE_FEATURES = [
  { key: 'mode', label: 'Mode' },
  { key: 'type', label: 'Type' },
  { key: 'location', label: 'Location', format: c => `${c.location?.city}, ${c.location?.state}` },
  { key: 'established', label: 'Established' },
  { key: 'rating', label: 'Rating', format: c => `${c.rating} ⭐ (${c.totalRatings?.toLocaleString()})` },
  { key: 'placementRate', label: 'Placement Rate', format: c => `${c.placementRate}%` },
  { key: 'averagePackage', label: 'Avg Package' },
  { key: 'totalStudents', label: 'Total Students', format: c => (c.totalStudents?.toLocaleString() || '0') + '+' },
  { key: 'accreditation', label: 'Accreditation', format: c => c.accreditation?.join(', ') },
];

const PROGRAMS = ['All', 'MBA', 'MCA', 'B.Tech', 'BCA', 'BBA', 'Data Science', 'Executive MBA'];

export default function CompareCourses() {
  const [colleges, setColleges] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [activeProgram, setActiveProgram] = useState('All');

  useEffect(() => {
    fetch(`${API}/colleges?limit=20`)
      .then(r => r.json())
      .then(d => setColleges(d.colleges || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!search.trim()) { setSearchResults([]); return; }
    setSearching(true);
    fetch(`${API}/colleges?search=${encodeURIComponent(search)}&limit=8`)
      .then(r => r.json())
      .then(d => setSearchResults(d.colleges || []))
      .catch(() => setSearchResults([]))
      .finally(() => setSearching(false));
  }, [search]);

  const addToCompare = (college) => {
    if (selected.find(c => c._id === college._id)) return;
    if (selected.length >= 3) { alert('You can compare up to 3 colleges at once.'); return; }
    setSelected(prev => [...prev, college]);
    setSearch('');
    setSearchResults([]);
  };

  const removeFromCompare = (id) => setSelected(prev => prev.filter(c => c._id !== id));

  const filteredColleges = activeProgram === 'All'
    ? colleges
    : colleges.filter(c => c.programs?.some(p => p.name.toLowerCase().includes(activeProgram.toLowerCase())));

  return (
    <div style={{ minHeight: '100vh', background: '#040d1a', paddingTop: 80, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a7a)', borderRadius: 20, padding: '40px 36px', marginBottom: 36, color: '#fff' }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Compare Colleges & Programs</h1>
          <p style={{ color: '#94a3b8', marginBottom: 24 }}>Compare MBA, MCA, B.Tech, BCA and more — side by side</p>

          {/* Program tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {PROGRAMS.map(p => (
              <button key={p} onClick={() => setActiveProgram(p)} style={{ padding: '7px 16px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: activeProgram === p ? '#f59e0b' : 'rgba(255,255,255,0.1)', color: activeProgram === p ? '#000' : '#fff', transition: 'all 0.2s' }}>
                {p}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 480 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search college to compare (e.g. Amity, LPU, IIT...)"
              style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: 10, border: 'none', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
            {search && (
              <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 100, overflow: 'hidden' }}>
                {searching && <div style={{ padding: 16, color: '#64748b', fontSize: 14 }}>Searching...</div>}
                {!searching && searchResults.length === 0 && <div style={{ padding: 16, color: '#64748b', fontSize: 14 }}>No colleges found</div>}
                {searchResults.map(c => (
                  <div key={c._id} onClick={() => addToCompare(c)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <div style={{ width: 36, height: 36, background: '#0d2045', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', fontWeight: 700, flexShrink: 0 }}>{c.name.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{c.location?.city}, {c.location?.state} · {c.mode}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>+ Add</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comparison table */}
        {selected.length > 0 && (
          <div style={{ background: '#0d1f3c', border: '1px solid #1a3a7a', borderRadius: 20, overflow: 'hidden', marginBottom: 36 }}>
            <div style={{ background: '#061428', padding: '20px 24px', borderBottom: '1px solid #1a3a7a' }}>
              <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>Comparison Table</h2>
            </div>

            {/* College headers */}
            <div style={{ display: 'grid', gridTemplateColumns: `200px repeat(${selected.length}, 1fr)`, borderBottom: '1px solid #1a3a7a' }}>
              <div style={{ padding: 20, background: '#061428' }}></div>
              {selected.map((c, i) => {
                const col = CARD_COLORS[i % CARD_COLORS.length];
                return (
                  <div key={c._id} style={{ padding: 20, borderLeft: '1px solid #1a3a7a', background: col.bg, position: 'relative' }}>
                    <button onClick={() => removeFromCompare(c._id)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><X size={14} /></button>
                    <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{c.name.charAt(0)}</div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{c.name}</h3>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{c.location?.city}</div>
                    <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {c.accreditation?.slice(0, 2).map(a => (
                        <span key={a} style={{ fontSize: 10, background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 4, padding: '2px 6px', fontWeight: 600 }}>{a}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feature rows */}
            {COMPARE_FEATURES.map((feature, i) => (
              <div key={feature.key} style={{ display: 'grid', gridTemplateColumns: `200px repeat(${selected.length}, 1fr)`, borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? '#0d1f3c' : '#061428' }}>
                <div style={{ padding: '14px 20px', fontWeight: 600, fontSize: 13, color: '#8899aa', borderRight: '1px solid #1a3a7a' }}>{feature.label}</div>
                {selected.map(c => (
                  <div key={c._id} style={{ padding: '14px 20px', fontSize: 14, color: '#ccd6f6', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                    {feature.format ? feature.format(c) : (c[feature.key] || '—')}
                  </div>
                ))}
              </div>
            ))}

            {/* Programs */}
            <div style={{ display: 'grid', gridTemplateColumns: `200px repeat(${selected.length}, 1fr)`, borderBottom: '1px solid #1a3a7a' }}>
              <div style={{ padding: '14px 20px', fontWeight: 600, fontSize: 13, color: '#8899aa', borderRight: '1px solid #1a3a7a' }}>Programs & Fees</div>
              {selected.map((c, i) => {
                const col = CARD_COLORS[i % CARD_COLORS.length];
                return (
                  <div key={c._id} style={{ padding: '14px 20px', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                    {c.programs?.map(p => (
                      <div key={p.name} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: '#8899aa', marginBottom: 4 }}>{p.duration}</div>
                        <div style={{ fontWeight: 700, color: col.accent, fontSize: 15 }}>₹{p.fees?.toLocaleString()}</div>
                        <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                          {p.emiAvailable && <span style={{ fontSize: 10, background: 'rgba(59,130,246,0.2)', color: '#60a5fa', borderRadius: 4, padding: '2px 6px' }}>EMI</span>}
                          {p.ugcApproved && <span style={{ fontSize: 10, background: 'rgba(34,197,94,0.2)', color: '#4ade80', borderRadius: 4, padding: '2px 6px' }}>UGC</span>}
                          {p.placementSupport && <span style={{ fontSize: 10, background: 'rgba(245,158,11,0.2)', color: '#fbbf24', borderRadius: 4, padding: '2px 6px' }}>Placement</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
              <div style={{ padding: 20, background: '#061428', borderRight: '1px solid #1a3a7a' }}></div>
              {selected.map(c => (
                <div key={c._id} style={{ padding: 16, borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link to={`/college/${c._id}`}>
                    <button style={{ width: '100%', padding: '10px', background: '#1a3a7a', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>View Details</button>
                  </Link>
                  <button onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })} style={{ width: '100%', padding: '10px', background: '#f59e0b', border: 'none', borderRadius: 8, color: '#000', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Apply Now</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selected.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 24px', background: '#0d1f3c', borderRadius: 16, border: '2px dashed #1a3a7a', marginBottom: 36 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏛️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Search and add colleges to compare</h3>
            <p style={{ color: '#8899aa', fontSize: 14 }}>Compare up to 3 colleges side by side</p>
          </div>
        )}

        {/* All colleges grid */}
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 20 }}>
            {activeProgram === 'All' ? 'All Colleges' : `Colleges offering ${activeProgram}`}
            <span style={{ fontSize: 14, color: '#8899aa', fontWeight: 400, marginLeft: 8 }}>({filteredColleges.length} found)</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filteredColleges.map((c, cidx) => {
              const col = CARD_COLORS[cidx % CARD_COLORS.length];
              return (
                <div key={c._id} style={{ background: col.bg, border: `1px solid ${col.accent}30`, borderRadius: 16, overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ padding: '20px 20px 16px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18, border: `2px solid ${col.accent}50` }}>{c.name.charAt(0)}</div>
                        <div>
                          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{c.name}</h3>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={10} />{c.location?.city}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#fbbf24', fontWeight: 700 }}>
                        ★ {c.rating}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                      {c.programs?.slice(0, 2).map(p => (
                        <span key={p.name} style={{ fontSize: 11, background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 6, padding: '3px 8px', fontWeight: 500 }}>
                          {p.name} · ₹{(p.fees / 1000).toFixed(0)}K
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '6px 10px', textAlign: 'center' }}>
                        <div style={{ color: '#4ade80', fontWeight: 700, fontSize: 14 }}>{c.placementRate}%</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>Placement</div>
                      </div>
                      <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '6px 10px', textAlign: 'center' }}>
                        <div style={{ color: col.accent, fontWeight: 700, fontSize: 14 }}>{c.averagePackage}</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>Avg Package</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 20px', display: 'flex', gap: 8 }}>
                    <button onClick={() => addToCompare(c)} style={{ flex: 1, padding: '8px', background: selected.find(s => s._id === c._id) ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, color: selected.find(s => s._id === c._id) ? '#4ade80' : '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                      {selected.find(s => s._id === c._id) ? '✓ Added' : '+ Compare'}
                    </button>
                    <Link to={`/college/${c._id}`} style={{ flex: 1 }}>
                      <button style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>View Details</button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
