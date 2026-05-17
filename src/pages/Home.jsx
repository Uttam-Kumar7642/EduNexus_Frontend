import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Star, Users, CheckCircle, ArrowRight, BookOpen, Monitor, Building2, GraduationCap, Code2, FileText, Globe, Phone, Mail, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const API = 'https://edunexus-backend-4es3.onrender.com/api';

const CARD_COLORS = [
  { bg: 'linear-gradient(135deg,#1e3a5f,#2d5a8e)', accent: '#60a5fa', border: 'rgba(96,165,250,0.3)' },
  { bg: 'linear-gradient(135deg,#1a3a2e,#2d5a47)', accent: '#4ade80', border: 'rgba(74,222,128,0.3)' },
  { bg: 'linear-gradient(135deg,#3d1f5c,#6b3fa0)', accent: '#c084fc', border: 'rgba(192,132,252,0.3)' },
  { bg: 'linear-gradient(135deg,#5c1f1f,#9b3a3a)', accent: '#f87171', border: 'rgba(248,113,113,0.3)' },
  { bg: 'linear-gradient(135deg,#3d2e0e,#7a5c1e)', accent: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  { bg: 'linear-gradient(135deg,#1e3a4f,#1e5f6b)', accent: '#22d3ee', border: 'rgba(34,211,238,0.3)' },
];


const TOP_CATEGORIES = [
  { name: 'Online Degrees', icon: <Monitor size={28}/>, sub: 'MBA, MCA, BBA & More', color: '#4F46E5', link: '/colleges?mode=Online' },
  { name: 'Offline Colleges', icon: <Building2 size={28}/>, sub: 'B.Tech, B.Ed, MBA & More', color: '#0891B2', link: '/colleges?mode=Offline' },
  { name: 'Kids Learning', icon: <GraduationCap size={28}/>, sub: 'Class 1-10, Future Ready', color: '#D97706', link: '/courses?category=Kids Learning' },
  { name: 'Coding & IT', icon: <Code2 size={28}/>, sub: 'Python, Java, AI, Data & More', color: '#059669', link: '/courses?category=Technology' },
  { name: 'Govt Exams', icon: <FileText size={28}/>, sub: 'IAS, SSC, Railway, Banking', color: '#DC2626', link: '/courses?category=Government Exams' },
  { name: 'Study Abroad', icon: <Globe size={28}/>, sub: 'Top Universities Worldwide', color: '#7C3AED', link: '/colleges?type=International' },
];

const POPULAR_PROGRAMS = [
  { title: 'Online MBA', duration: '2 Years', tag: 'UGC Approved', rating: 4.7, reviews: 2840, mode: 'Online', search: 'MBA' },
  { title: 'Executive MBA', duration: '1 Year', tag: 'For Professionals', rating: 4.6, reviews: 1200, mode: 'Online', search: 'Executive MBA' },
  { title: 'Online MCA', duration: '2 Years', tag: 'UGC Approved', rating: 4.8, reviews: 980, mode: 'Online', search: 'MCA' },
  { title: 'B.Tech (CSE)', duration: '4 Years', tag: 'Full Time', rating: 4.8, reviews: 3200, mode: 'Offline', search: 'B.Tech' },
];

const STATS = [
  { icon: '📚', value: '1000+', label: 'Courses' },
  { icon: '🏛️', value: '200+', label: 'Top Universities' },
  { icon: '🏆', value: '50K+', label: 'Success Stories' },
  { icon: '📞', value: '24/7', label: 'Student Support' },
];

const TESTIMONIALS = [
  { name: 'Rohan Mehta', role: 'B.Tech, IIT Roorkee', text: 'EduNexus helped me find the right college. I am placed in my dream company!', avatar: 'R' },
  { name: 'Anjali Sharma', role: 'MBA, Amity Online', text: 'Excellent platform for online learning. Mentors are very supportive!', avatar: 'A' },
  { name: 'Vikram Singh', role: 'NEET Score - 645', text: 'The test series and doubt sessions helped me crack NEET.', avatar: 'V' },
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [featuredColleges, setFeaturedColleges] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('Trending');
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', courseInterest: '' });
  const [leadLoading, setLeadLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/colleges/featured`).then(r => r.json()).then(d => setFeaturedColleges(d.colleges || [])).catch(() => {});
    fetch(`${API}/courses?limit=4&sort=popular`).then(r => r.json()).then(d => setFeaturedCourses(d.courses || [])).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    if (searchType === 'colleges') navigate(`/colleges?search=${encodeURIComponent(search)}`);
    else if (searchType === 'courses') navigate(`/courses?search=${encodeURIComponent(search)}`);
    else {
      // search both — default to colleges if looks like institution name
      navigate(`/colleges?search=${encodeURIComponent(search)}`);
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email || !leadForm.phone) return toast.error('Name, email and phone required.');
    setLeadLoading(true);
    try {
      const res = await fetch(`${API}/leads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(leadForm) });
      const data = await res.json();
      if (data.success) { toast.success('Our expert will contact you within 24 hours! 🎉'); setLeadForm({ name: '', email: '', phone: '', courseInterest: '' }); }
      else toast.error(data.message || 'Submission failed.');
    } catch { toast.error('Something went wrong.'); }
    finally { setLeadLoading(false); }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg,#0a1628 0%,#0d2045 60%,#1a3a7a 100%)', paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 100, padding: '6px 14px', marginBottom: 20 }}>
                <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>🇮🇳 India's Education Operating System</span>
              </div>
              <h1 style={{ color: '#fff', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
                Admissions. Learning.<br />
                <span style={{ color: '#f59e0b' }}>Careers. Global Skills.</span>
              </h1>
              <p style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.7, marginBottom: 32 }}>
                Your trusted partner from School to Success.<br />
                Explore courses, compare colleges and learn from India's best.
              </p>

              {/* Search type selector */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {[['all', 'All'], ['colleges', 'Colleges'], ['courses', 'Courses']].map(([val, label]) => (
                  <button key={val} onClick={() => setSearchType(val)} style={{ padding: '6px 16px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: searchType === val ? '#f59e0b' : 'rgba(255,255,255,0.1)', color: searchType === val ? '#000' : '#fff', transition: 'all 0.2s' }}>{label}</button>
                ))}
              </div>

              {/* Search bar */}
              <form onSubmit={handleSearch} style={{ display: 'flex', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', marginBottom: 28 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder={searchType === 'colleges' ? 'Search colleges, universities...' : searchType === 'courses' ? 'Search courses, skills...' : 'Search courses, colleges, exams...'} style={{ width: '100%', padding: '14px 16px 14px 48px', border: 'none', outline: 'none', fontSize: 15, color: '#1e293b', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" style={{ padding: '14px 28px', background: '#f59e0b', border: 'none', color: '#000', fontWeight: 700, fontSize: 15, cursor: 'pointer', whiteSpace: 'nowrap' }}>Search</button>
              </form>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/courses"><button style={{ padding: '12px 24px', background: '#f59e0b', border: 'none', borderRadius: 10, color: '#000', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>Explore Courses <ArrowRight size={16} /></button></Link>
                <Link to="/colleges"><button style={{ padding: '12px 24px', background: 'transparent', border: '2px solid rgba(255,255,255,0.3)', borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Browse Colleges</button></Link>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[['🎓','Trusted by','10M+ Students'],['👨‍🏫','Expert Mentors','From Top Universities'],['⭐','Google Rating','4.8/5 (20K+ Reviews)'],['🏆','Success Stories','50K+ Achievers']].map(([icon, label, val], i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                  <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>{label}</div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '20px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 20 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 20, color: '#1e293b' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TOP CATEGORIES ── */}
      <section style={{ padding: '60px 0', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1e293b' }}>Explore Top Categories</h2>
            <Link to="/courses" style={{ color: '#f59e0b', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>View all <ArrowRight size={14} /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {TOP_CATEGORIES.map(cat => (
              <Link key={cat.name} to={cat.link}>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = cat.color; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: cat.color }}>{cat.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', marginBottom: 4 }}>{cat.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{cat.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR PROGRAMS ── */}
      <section style={{ padding: '60px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1e293b' }}>Popular Courses</h2>
            <Link to="/courses" style={{ color: '#f59e0b', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>View all <ArrowRight size={14} /></Link>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {['Trending', 'Top Rated', 'Most Enrolled'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 18px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: activeTab === tab ? '#f59e0b' : '#f1f5f9', color: activeTab === tab ? '#000' : '#64748b' }}>{tab}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {POPULAR_PROGRAMS.map((prog, i) => {
              const PCOLS = [
                { bg: 'linear-gradient(135deg,#1e3a5f,#2d5a8e)', accent: '#60a5fa', tag: 'rgba(96,165,250,0.2)' },
                { bg: 'linear-gradient(135deg,#3d1f5c,#6b3fa0)', accent: '#c084fc', tag: 'rgba(192,132,252,0.2)' },
                { bg: 'linear-gradient(135deg,#1a3a2e,#2d5a47)', accent: '#4ade80', tag: 'rgba(74,222,128,0.2)' },
                { bg: 'linear-gradient(135deg,#3d2e0e,#7a5c1e)', accent: '#fbbf24', tag: 'rgba(251,191,36,0.2)' },
              ];
              const col = PCOLS[i % PCOLS.length];
              return (
              <div key={i} style={{ background: col.bg, border: `1px solid ${col.accent}30`, borderRadius: 16, overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ padding: '20px 20px 16px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, background: col.tag, color: col.accent, borderRadius: 6, padding: '4px 10px', fontWeight: 700, border: `1px solid ${col.accent}40` }}>{prog.tag}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: '3px 8px' }}>{prog.mode}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{prog.title}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 14 }}>{prog.duration}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 0 }}>
                    <Star size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                    <strong style={{ fontSize: 14, color: '#fff' }}>{prog.rating}</strong>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>({prog.reviews.toLocaleString()} reviews)</span>
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 20px', display: 'flex', gap: 8 }}>
                  <Link to={`/compare-courses?program=${encodeURIComponent(prog.search)}`} style={{ flex: 1 }}>
                    <button style={{ width: '100%', padding: '9px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Compare</button>
                  </Link>
                  <Link to={`/colleges?search=${encodeURIComponent(prog.search)}`} style={{ flex: 1 }}>
                    <button style={{ width: '100%', padding: '9px', background: col.accent, border: 'none', borderRadius: 8, color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Explore</button>
                  </Link>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES FROM DB ── */}
      {featuredCourses.length > 0 && (
        <section style={{ padding: '60px 0', background: `linear-gradient(135deg, rgb(10, 22, 40), rgb(13, 32, 69))` }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>Featured Courses</h2>
              <Link to="/courses" style={{ color: '#f59e0b', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>View all <ArrowRight size={14} /></Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {featuredCourses.map(course => (
                <Link key={course._id} to={`/course-details/${course._id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#0d1f3c', border: '1px solid #1a3a7a', borderRadius: 14, overflow: 'hidden', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ height: 160, background: 'linear-gradient(135deg,#1a3a7a,#0d4a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <BookOpen size={36} color="rgba(245,158,11,0.5)" />
                    </div>
                    <div style={{ padding: 16 }}>
                      <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>{course.category}</div>
                      <h3 style={{ fontSize: 14, fontWeight: 700,  marginBottom: 8, lineHeight: 1.4 }}>{course.title}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#0d2045', fontSize: 16 }}>₹{course.price?.toLocaleString()}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                          <Star size={12} style={{ color: '#f59e0b', fill: '#f59e0b' }} />{course.rating?.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TOP UNIVERSITIES FROM DB ── */}
      <section style={{ padding: '60px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1e293b' }}>Top Universities & Partners</h2>
            <Link to="/colleges" style={{ color: '#f59e0b', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>View all <ArrowRight size={14} /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {featuredColleges.slice(0, 6).map((college, idx) => {
              const COLS = [
                { bg: 'linear-gradient(135deg,#1e3a5f,#2d5a8e)', accent: '#60a5fa' },
                { bg: 'linear-gradient(135deg,#1a3a2e,#2d5a47)', accent: '#4ade80' },
                { bg: 'linear-gradient(135deg,#3d1f5c,#6b3fa0)', accent: '#c084fc' },
                { bg: 'linear-gradient(135deg,#5c1f1f,#9b3a3a)', accent: '#f87171' },
                { bg: 'linear-gradient(135deg,#3d2e0e,#7a5c1e)', accent: '#fbbf24' },
                { bg: 'linear-gradient(135deg,#1e3a4f,#1e5f6b)', accent: '#22d3ee' },
              ];
              const col = COLS[idx % COLS.length];
              return (
              <Link key={college._id} to={`/college/${college._id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: col.bg, borderRadius: 16, overflow: 'hidden', border: `1px solid ${col.accent}30`, transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ padding: '20px 20px 16px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 46, height: 46, background: 'rgba(255,255,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20, flexShrink: 0, border: `2px solid ${col.accent}50` }}>{college.name.charAt(0)}</div>
                      <div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2, lineHeight: 1.3 }}>{college.name}</h3>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{college.location?.city}, {college.location?.state}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                      {college.accreditation?.slice(0, 2).map(a => <span key={a} style={{ fontSize: 10, background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 4, padding: '2px 7px', fontWeight: 600 }}>{a}</span>)}
                      <span style={{ fontSize: 10, background: `${col.accent}25`, color: col.accent, borderRadius: 4, padding: '2px 7px', fontWeight: 600 }}>{college.mode}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Avg: <strong style={{ color: col.accent }}>{college.averagePackage}</strong></span>
                      <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700 }}>★ {college.rating}</span>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{college.totalStudents?.toLocaleString()}+ students</span>
                    <span style={{ fontSize: 12, color: col.accent, fontWeight: 600 }}>View Details →</span>
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMPARE SECTION ── */}
      <section style={{ padding: '60px 0', background: 'linear-gradient(135deg,#0a1628,#0d2045)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Compare. Decide. Enroll.</h2>
            <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 24, lineHeight: 1.7 }}>Find the best college for your future with our comparison tool.</p>
            {['Compare Universities side by side', 'Check Fees & Placements', 'EMI & Scholarship options', '100% Trusted & Verified'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <CheckCircle size={18} style={{ color: '#f59e0b' }} />
                <span style={{ color: '#e2e8f0', fontSize: 15 }}>{f}</span>
              </div>
            ))}
            <Link to="/compare-courses">
              <button style={{ marginTop: 24, padding: '13px 28px', background: '#f59e0b', border: 'none', borderRadius: 10, color: '#000', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                Compare Now <ArrowRight size={16} />
              </button>
            </Link>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 24 }}>
            <h4 style={{ color: '#f59e0b', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Compare Online MBA Programs</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ color: '#94a3b8', textAlign: 'left', padding: '8px 0' }}></th>
                  {['Amity','Manipal','LPU'].map(u => <th key={u} style={{ color: '#fff', textAlign: 'center', padding: '8px 4px', fontSize: 12 }}>{u}</th>)}
                </tr>
              </thead>
              <tbody>
                {[['Fees','₹1.75L','₹1.60L','₹1.20L'],['Duration','2 Yrs','2 Yrs','2 Yrs'],['UGC','✅','✅','✅'],['Placement','✅','✅','✅'],['EMI','✅','✅','✅']].map(([label,...vals]) => (
                  <tr key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ color: '#94a3b8', padding: '10px 0', fontSize: 12 }}>{label}</td>
                    {vals.map((v,i) => <td key={i} style={{ color: '#e2e8f0', textAlign: 'center', padding: '10px 4px' }}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── TALK TO EXPERT FORM ── */}
      <section id="lead-form" style={{ padding: '60px 0', background: '#f8fafc' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: 36, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>Talk to an Expert</h2>
              <p style={{ color: '#64748b', fontSize: 14 }}>Get free counselling — our expert calls you within 24 hours</p>
            </div>
            <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['text','Full Name *','name'],['email','Email Address *','email'],['tel','Phone Number *','phone']].map(([type, ph, field]) => (
                <input key={field} type={type} placeholder={ph} value={leadForm[field]} onChange={e => setLeadForm(p => ({ ...p, [field]: e.target.value }))} style={{ padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 15, outline: 'none', fontFamily: 'inherit', color: '#1e293b' }} />
              ))}
              <select value={leadForm.courseInterest} onChange={e => setLeadForm(p => ({ ...p, courseInterest: e.target.value }))} style={{ padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 15, outline: 'none', cursor: 'pointer', color: leadForm.courseInterest ? '#1e293b' : '#94a3b8', fontFamily: 'inherit' }}>
                <option value="">Select Course Interest</option>
                {['MBA','MCA','B.Tech','BCA','BBA','Data Science','Digital Marketing','Web Development','Other'].map(c => <option key={c}>{c}</option>)}
              </select>
              <button type="submit" disabled={leadLoading} style={{ padding: '13px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 10, color: '#000', fontWeight: 700, fontSize: 15, cursor: leadLoading ? 'not-allowed' : 'pointer', opacity: leadLoading ? 0.7 : 1 }}>
                {leadLoading ? 'Submitting...' : 'Get Free Counselling →'}
              </button>
              <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>🔒 Your information is 100% secure</p>
            </form>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '60px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1e293b', marginBottom: 32, textAlign: 'center' }}>Success Stories</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />)}
                </div>
                <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0d2045', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', fontWeight: 700 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
