import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X, BookOpen, Star, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All','Technology','Business','Design','Marketing','Finance','Language'];
const LEVELS = ['All','Beginner','Intermediate','Advanced','All Levels'];

const API = "http://localhost:5000/api";

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [sort, setSort] = useState('newest');
  const [showFilter, setShowFilter] = useState(false);

  // Read category from URL on mount
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, []);

  // Fetch courses whenever filters change
  useEffect(() => {
    setLoading(true);
    let url = `${API}/courses?limit=100`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category && category !== 'All') url += `&category=${encodeURIComponent(category)}`;
    if (level && level !== 'All') url += `&level=${encodeURIComponent(level)}`;
    if (sort) url += `&sort=${sort}`;

    console.log('Fetching:', url);

    fetch(url)
      .then(r => r.json())
      .then(data => {
        console.log('Got courses:', data.total, data.courses?.length);
        setCourses(data.courses || []);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setCourses([]);
      })
      .finally(() => setLoading(false));
  }, [search, category, level, sort]);

  const selectCategory = (cat) => {
    setCategory(cat);
    if (cat === 'All') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#040d1a', paddingTop: 80, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 700, marginBottom: 6 }}>
            {category !== 'All' ? `${category} Courses` : 'All Courses'}
          </h1>
          <p style={{ color: '#8899aa' }}>{loading ? 'Loading...' : `${courses.length} courses found`}</p>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => selectCategory(cat)} style={{
              padding: '8px 18px', borderRadius: 100, cursor: 'pointer', fontSize: 14, fontWeight: 600,
              background: category === cat ? '#f59e0b' : '#0d1f3c',
              color: category === cat ? '#000' : '#8899aa',
              border: category === cat ? '2px solid #f59e0b' : '1px solid #1a3a7a',
              transition: 'all 0.2s'
            }}>{cat}</button>
          ))}
        </div>

        {/* Search bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 10, background: '#0d1f3c', border: '1px solid #1a3a7a', borderRadius: 10, padding: '10px 16px' }}>
            <Search size={16} style={{ color: '#8899aa' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 14, width: '100%', fontFamily: 'inherit' }} />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8899aa' }}><X size={14} /></button>}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: '#0d1f3c', border: '1px solid #1a3a7a', borderRadius: 10, padding: '10px 16px', color: '#fff', fontSize: 14, outline: 'none', cursor: 'pointer' }}>
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <button onClick={() => setShowFilter(!showFilter)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0d1f3c', border: '1px solid #1a3a7a', borderRadius: 10, padding: '10px 16px', color: '#fff', fontSize: 14, cursor: 'pointer' }}>
            <Filter size={16} /> Level
          </button>
        </div>

        {showFilter && (
          <div style={{ background: '#0d1f3c', border: '1px solid #1a3a7a', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {LEVELS.map(l => (
                <button key={l} onClick={() => setLevel(l)} style={{ padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: level === l ? '#f59e0b' : '#1a3a7a', color: level === l ? '#000' : '#ccd6f6' }}>{l}</button>
              ))}
            </div>
          </div>
        )}

        {/* Course Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <div style={{ width: 40, height: 40, border: '3px solid #1a3a7a', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <BookOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.3, color: '#8899aa' }} />
            <h3 style={{ color: '#ccd6f6', marginBottom: 8 }}>No courses found</h3>
            <p style={{ color: '#8899aa' }}>Try a different category or clear filters.</p>
            <button onClick={() => { setCategory('All'); setSearch(''); setLevel('All'); setSearchParams({}); }} style={{ marginTop: 16, padding: '10px 24px', background: '#f59e0b', border: 'none', borderRadius: 8, color: '#000', fontWeight: 600, cursor: 'pointer' }}>
              View All Courses
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {courses.map(course => (
              <div key={course._id} style={{ background: '#0d1f3c', border: '1px solid #1a3a7a', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <Link to={`/course-details/${course._id}`} style={{ textDecoration: 'none', flex: 1 }}>
                  <div style={{ height: 160, background: course.thumbnail ? `url(${course.thumbnail}) center/cover` : 'linear-gradient(135deg,#1a3a7a,#0d4a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {!course.thumbnail && <BookOpen size={40} color="rgba(255,255,255,0.3)" />}
                    <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(245,158,11,0.92)', color: '#000', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>{course.level}</div>
                    {course.originalPrice > course.price && <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(239,68,68,0.92)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>{Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF</div>}
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>{course.category}</div>
                    <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 600, marginBottom: 8, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 42 }}>{course.title}</h3>
                    <p style={{ color: '#8899aa', fontSize: 13, marginBottom: 10 }}>by {course.instructorName}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#8899aa', marginBottom: 12 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Star size={12} style={{ color: '#f59e0b', fill: '#f59e0b' }} /><strong style={{ color: '#fff' }}>{course.rating?.toFixed(1)}</strong></span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Users size={12} />{course.totalStudents?.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 18 }}>₹{course.price?.toLocaleString()}</span>
                      {course.originalPrice > course.price && <span style={{ color: '#8899aa', fontSize: 13, textDecoration: 'line-through' }}>₹{course.originalPrice?.toLocaleString()}</span>}
                    </div>
                  </div>
                </Link>
                <div style={{ padding: '0 16px 16px' }}>
                  {isAdmin ? (
                    <button style={{ width: '100%', padding: 10, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: '#f59e0b', fontWeight: 600, cursor: 'pointer' }}>Edit Course</button>
                  ) : (
                    <Link to={`/course-details/${course._id}`} style={{ display: 'block' }}>
                      <button style={{ width: '100%', padding: 10, background: 'linear-gradient(135deg,#1a3a7a,#2a5aa8)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Enroll Now</button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
