import { useState, useEffect } from 'react';
import {
  Users, BookOpen, DollarSign, TrendingUp, Plus, Eye, Trash2, X,
  Shield, ShieldOff, CheckCircle, Clock, BarChart2, Activity,
  AlertTriangle, Search, ChevronRight, Award, PlayCircle
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import styles from './AdminDashboard.module.css';

const CATEGORIES = ['Web Development','Data Science','Design','Business','Marketing','Photography','Music','Health & Fitness','Finance','Language'];
const LEVELS = ['Beginner','Intermediate','Advanced','All Levels'];

const MOCK_STATS = { totalUsers: 52480, totalCourses: 1248, totalRevenue: 4280000, totalLeads: 8940 };
const MOCK_PAYMENTS = [
  { _id: '1', user: { name: 'Priya Sharma', email: 'priya@mail.com' }, course: { title: 'React & Next.js' }, amount: 2499, createdAt: new Date() },
  { _id: '2', user: { name: 'Rohit Verma', email: 'rohit@mail.com' }, course: { title: 'Python DS & ML' }, amount: 2799, createdAt: new Date() },
  { _id: '3', user: { name: 'Ananya Patel', email: 'ananya@mail.com' }, course: { title: 'Figma UI/UX' }, amount: 1999, createdAt: new Date() },
];
const MOCK_USERS = [
  { _id: '1', name: 'Priya Sharma', email: 'priya@mail.com', createdAt: new Date(), isBlocked: false, enrolledCourses: ['React','Python'], progress: [{ course:'React', percentage:85 },{ course:'Python', percentage:42 }], quizResults: [{ title:'React Quiz', score:90, passed:true },{ title:'JS Basics', score:65, passed:true }], totalSessions: 48, lastActive: new Date() },
  { _id: '2', name: 'Rohit Verma', email: 'rohit@mail.com', createdAt: new Date(), isBlocked: false, enrolledCourses: ['Python','ML'], progress: [{ course:'Python', percentage:100 },{ course:'ML', percentage:30 }], quizResults: [{ title:'Python Quiz', score:78, passed:true }], totalSessions: 23, lastActive: new Date() },
  { _id: '3', name: 'Ananya Patel', email: 'ananya@mail.com', createdAt: new Date(), isBlocked: true, enrolledCourses: ['Figma'], progress: [{ course:'Figma', percentage:60 }], quizResults: [{ title:'Design Quiz', score:45, passed:false }], totalSessions: 12, lastActive: new Date() },
  { _id: '4', name: 'Vikram Singh', email: 'vikram@mail.com', createdAt: new Date(), isBlocked: false, enrolledCourses: ['React','Figma','Python'], progress: [{ course:'React', percentage:100 },{ course:'Figma', percentage:100 },{ course:'Python', percentage:75 }], quizResults: [{ title:'React Quiz', score:95, passed:true },{ title:'Design Quiz', score:88, passed:true }], totalSessions: 91, lastActive: new Date() },
  { _id: '5', name: 'Sneha Gupta', email: 'sneha@mail.com', createdAt: new Date(), isBlocked: false, enrolledCourses: ['Marketing'], progress: [{ course:'Marketing', percentage:20 }], quizResults: [], totalSessions: 5, lastActive: new Date() },
];
const MOCK_COURSES = [
  { _id: '1', title: 'Advanced React & Next.js', category: 'Technology', enrollmentCount: 12000, price: 4999, discountPrice: 2499, isPublished: true },
  { _id: '2', title: 'Python for Data Science', category: 'Technology', enrollmentCount: 18000, price: 5499, discountPrice: 2799, isPublished: true },
  { _id: '3', title: 'Figma UI/UX Design', category: 'Design', enrollmentCount: 8900, price: 3999, discountPrice: 1999, isPublished: true },
  { _id: '4', title: 'Digital Marketing Guide', category: 'Marketing', enrollmentCount: 4200, price: 3499, discountPrice: 1499, isPublished: false },
];

// ─── Shared input style ───────────────────────────────────────────────────────
const inp = {
  width: '100%', padding: '10px 14px', background: '#061428',
  border: '1px solid #1a3a7a', borderRadius: 8, color: '#fff',
  fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
};

// ─── Add Course Modal ─────────────────────────────────────────────────────────
function AddCourseModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', shortDescription: '', description: '', category: '',
    level: 'Beginner', language: 'English', price: '', originalPrice: '',
    instructorName: '', instructorBio: '', thumbnail: '', previewVideo: '',
    tags: '', isFree: false, isPublished: true, isFeatured: false, certificate: true,
    whatYouLearn: ['', ''], requirements: [''],
  });
  const set = (field) => (e) => { const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value; setForm(p => ({ ...p, [field]: val })); };
  const setList = (field, idx, val) => setForm(p => { const a = [...p[field]]; a[idx] = val; return { ...p, [field]: a }; });
  const addItem = (field) => setForm(p => ({ ...p, [field]: [...p[field], ''] }));
  const removeItem = (field, idx) => setForm(p => ({ ...p, [field]: p[field].filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || (!form.isFree && !form.price)) return toast.error('Title, description, category and price are required.');
    setLoading(true);
    try {
      await api.post('/courses', { ...form, price: form.isFree ? 0 : Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), whatYouLearn: form.whatYouLearn.filter(Boolean), requirements: form.requirements.filter(Boolean) });
      toast.success('Course created successfully!');
      onSuccess?.(); onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create course'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }}>
      <div style={{ background: '#0d1f3c', border: '1px solid #1a3a7a', borderRadius: 16, width: '100%', maxWidth: 780, boxShadow: '0 24px 80px rgba(0,0,0,0.7)', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px', borderBottom: '1px solid #1a3a7a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#1a3a7a,#2a5aa8)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={20} color="#f59e0b" /></div>
            <div><h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Add New Course</h2><p style={{ color: '#8899aa', fontSize: 13, margin: 0 }}>Fill in all details to publish</p></div>
          </div>
          <button onClick={onClose} style={{ background: '#1a3a7a', border: 'none', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8899aa' }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {[['title','Course Title *','e.g. Complete React Bootcamp','1/-1'],['shortDescription','Short Description','One-line summary shown on cards','1/-1'],].map(([field, label, ph, col]) => (
              <div key={field} style={{ gridColumn: col }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8899aa', marginBottom: 6 }}>{label}</label>
                <input style={inp} placeholder={ph} value={form[field]} onChange={set(field)} />
              </div>
            ))}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8899aa', marginBottom: 6 }}>Full Description *</label>
              <textarea style={{ ...inp, resize: 'vertical', minHeight: 90 }} placeholder="Detailed course description..." value={form.description} onChange={set('description')} rows={4} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8899aa', marginBottom: 6 }}>Category *</label>
              <select style={inp} value={form.category} onChange={set('category')}><option value="">Select category</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8899aa', marginBottom: 6 }}>Level</label>
              <select style={inp} value={form.level} onChange={set('level')}>{LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8899aa', marginBottom: 6 }}>Price (₹) *</label>
              <input style={inp} type="number" placeholder="e.g. 1999" value={form.price} onChange={set('price')} disabled={form.isFree} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8899aa', marginBottom: 6 }}>Original Price (₹)</label>
              <input style={inp} type="number" placeholder="e.g. 4999" value={form.originalPrice} onChange={set('originalPrice')} disabled={form.isFree} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8899aa', marginBottom: 6 }}>Instructor Name</label>
              <input style={inp} placeholder="e.g. John Smith" value={form.instructorName} onChange={set('instructorName')} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8899aa', marginBottom: 6 }}>Tags (comma separated)</label>
              <input style={inp} placeholder="react, javascript, frontend" value={form.tags} onChange={set('tags')} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8899aa', marginBottom: 6 }}>Thumbnail URL</label>
              <input style={inp} placeholder="https://..." value={form.thumbnail} onChange={set('thumbnail')} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8899aa', marginBottom: 6 }}>Preview Video URL</label>
              <input style={inp} placeholder="https://youtube.com/..." value={form.previewVideo} onChange={set('previewVideo')} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8899aa', marginBottom: 8 }}>What Students Will Learn</label>
              {form.whatYouLearn.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input style={{ ...inp, flex: 1 }} placeholder={`Learning outcome ${i + 1}`} value={item} onChange={e => setList('whatYouLearn', i, e.target.value)} />
                  {form.whatYouLearn.length > 1 && <button type="button" onClick={() => removeItem('whatYouLearn', i)} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444', flexShrink: 0 }}><Trash2 size={14} /></button>}
                </div>
              ))}
              <button type="button" onClick={() => addItem('whatYouLearn')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.08)', border: '1px dashed rgba(245,158,11,0.4)', borderRadius: 8, padding: '7px 14px', color: '#f59e0b', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}><Plus size={14} /> Add Learning Point</button>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8899aa', marginBottom: 8 }}>Requirements</label>
              {form.requirements.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input style={{ ...inp, flex: 1 }} placeholder={`Requirement ${i + 1}`} value={item} onChange={e => setList('requirements', i, e.target.value)} />
                  {form.requirements.length > 1 && <button type="button" onClick={() => removeItem('requirements', i)} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444', flexShrink: 0 }}><Trash2 size={14} /></button>}
                </div>
              ))}
              <button type="button" onClick={() => addItem('requirements')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.08)', border: '1px dashed rgba(245,158,11,0.4)', borderRadius: 8, padding: '7px 14px', color: '#f59e0b', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}><Plus size={14} /> Add Requirement</button>
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', flexWrap: 'wrap', gap: 28, paddingTop: 8 }}>
              {[['isFree','Free Course'],['isPublished','Publish Now'],['isFeatured','Featured'],['certificate','Certificate']].map(([field, label]) => (
                <label key={field} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: '#ccd6f6', fontSize: 14, fontWeight: 500 }}>
                  <div style={{ position: 'relative', width: 40, height: 22, flexShrink: 0 }}>
                    <div onClick={() => setForm(p => ({ ...p, [field]: !p[field] }))} style={{ position: 'absolute', inset: 0, borderRadius: 11, background: form[field] ? '#f59e0b' : '#1a3a7a', cursor: 'pointer', transition: 'background 0.2s' }}>
                      <div style={{ position: 'absolute', top: 3, left: form[field] ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                    </div>
                  </div>
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 28, paddingTop: 24, borderTop: '1px solid #1a3a7a' }}>
            <button type="button" onClick={onClose} style={{ padding: '11px 24px', background: 'transparent', border: '1px solid #1a3a7a', borderRadius: 10, color: '#8899aa', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: '11px 28px', background: loading ? '#555' : 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 10, color: '#000', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
              {loading ? 'Creating...' : <><BookOpen size={16} /> Create Course</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Student Detail Modal ─────────────────────────────────────────────────────
function StudentDetailModal({ student, onClose, onBlock, onDelete }) {
  const completedCourses = student.progress?.filter(p => p.percentage === 100) || [];
  const inProgressCourses = student.progress?.filter(p => p.percentage > 0 && p.percentage < 100) || [];
  const passedQuizzes = student.quizResults?.filter(q => q.passed) || [];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }}>
      <div style={{ background: '#0d1f3c', border: '1px solid #1a3a7a', borderRadius: 16, width: '100%', maxWidth: 680, boxShadow: '0 24px 80px rgba(0,0,0,0.7)', marginBottom: 24 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px', borderBottom: '1px solid #1a3a7a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#1a3a7a,#2a5aa8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#f59e0b' }}>
              {student.name?.charAt(0)}
            </div>
            <div>
              <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                {student.name}
                {student.isBlocked && <span style={{ fontSize: 11, background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '2px 8px', fontWeight: 600 }}>BLOCKED</span>}
              </h2>
              <p style={{ color: '#8899aa', fontSize: 13, margin: 0 }}>{student.email}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#1a3a7a', border: 'none', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8899aa' }}><X size={18} /></button>
        </div>

        <div style={{ padding: 28 }}>
          {/* Activity Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
            {[
              { icon: <BookOpen size={16} />, label: 'Enrolled', value: student.enrolledCourses?.length || 0, color: '#f59e0b' },
              { icon: <CheckCircle size={16} />, label: 'Completed', value: completedCourses.length, color: '#22c55e' },
              { icon: <PlayCircle size={16} />, label: 'Sessions', value: student.totalSessions || 0, color: '#2dd4bf' },
              { icon: <Award size={16} />, label: 'Quizzes Passed', value: passedQuizzes.length, color: '#a78bfa' },
            ].map(({ icon, label, value, color }) => (
              <div key={label} style={{ background: '#061428', border: '1px solid #1a3a7a', borderRadius: 12, padding: '14px 12px', textAlign: 'center' }}>
                <div style={{ color, marginBottom: 6, display: 'flex', justifyContent: 'center' }}>{icon}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{value}</div>
                <div style={{ fontSize: 12, color: '#8899aa', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Course Progress */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ color: '#ccd6f6', fontSize: 15, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart2 size={16} color="#f59e0b" /> Course Progress
            </h3>
            {student.progress?.length ? student.progress.map((p, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, color: '#ccd6f6', fontWeight: 500 }}>{p.course}</span>
                  <span style={{ fontSize: 13, color: p.percentage === 100 ? '#22c55e' : '#f59e0b', fontWeight: 600 }}>
                    {p.percentage === 100 ? '✓ Completed' : `${p.percentage}%`}
                  </span>
                </div>
                <div style={{ background: '#1a3a7a', borderRadius: 100, height: 7, overflow: 'hidden' }}>
                  <div style={{ width: `${p.percentage}%`, height: '100%', background: p.percentage === 100 ? 'linear-gradient(90deg,#22c55e,#16a34a)' : 'linear-gradient(90deg,#f59e0b,#d97706)', borderRadius: 100, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            )) : <p style={{ color: '#8899aa', fontSize: 14 }}>No courses enrolled yet.</p>}
          </div>

          {/* Quiz Results */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ color: '#ccd6f6', fontSize: 15, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} color="#f59e0b" /> Quiz Results
            </h3>
            {student.quizResults?.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {student.quizResults.map((q, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#061428', border: '1px solid #1a3a7a', borderRadius: 10, padding: '12px 16px' }}>
                    <span style={{ fontSize: 14, color: '#ccd6f6' }}>{q.title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{q.score}%</span>
                      <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 100, fontWeight: 600, background: q.passed ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: q.passed ? '#22c55e' : '#ef4444', border: `1px solid ${q.passed ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                        {q.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p style={{ color: '#8899aa', fontSize: 14 }}>No quizzes attempted yet.</p>}
          </div>

          {/* Last Active */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, color: '#8899aa', fontSize: 13 }}>
            <Clock size={14} />
            Last active: {student.lastActive ? new Date(student.lastActive).toLocaleString('en-IN') : 'N/A'}
            &nbsp;·&nbsp; Joined: {new Date(student.createdAt).toLocaleDateString('en-IN')}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 20, borderTop: '1px solid #1a3a7a' }}>
            <button
              onClick={() => { onBlock(student); onClose(); }}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', border: 'none', background: student.isBlocked ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)', color: student.isBlocked ? '#22c55e' : '#f59e0b' }}>
              {student.isBlocked ? <><Shield size={15} /> Unblock Student</> : <><ShieldOff size={15} /> Block Student</>}
            </button>
            <button
              onClick={() => { if (window.confirm(`Delete ${student.name}? This cannot be undone.`)) { onDelete(student._id); onClose(); } }}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', border: 'none', background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
              <Trash2 size={15} /> Delete Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState(MOCK_USERS);
  const [courses, setCourses] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSearch, setStudentSearch] = useState('');

  const fetchCourses = () => api.get('/courses').then(res => setCourses(res.data.courses)).catch(() => setCourses(MOCK_COURSES));

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => { setStats(res.data.stats); setPayments(res.data.recentPayments || []); setUsers(res.data.recentUsers || MOCK_USERS); })
      .catch(() => { setStats(MOCK_STATS); setPayments(MOCK_PAYMENTS); setUsers(MOCK_USERS); })
      .finally(() => setLoading(false));
    fetchCourses();
  }, []);

  const handleBlock = async (student) => {
    try {
      await api.put(`/admin/users/${student._id}`, { isBlocked: !student.isBlocked });
      setUsers(prev => prev.map(u => u._id === student._id ? { ...u, isBlocked: !u.isBlocked } : u));
      toast.success(`Student ${student.isBlocked ? 'unblocked' : 'blocked'} successfully.`);
    } catch {
      setUsers(prev => prev.map(u => u._id === student._id ? { ...u, isBlocked: !u.isBlocked } : u));
      toast.success(`Student ${student.isBlocked ? 'unblocked' : 'blocked'}.`);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('Student deleted.');
    } catch {
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('Student removed.');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const s = stats || MOCK_STATS;
  const STAT_CARDS = [
    { icon: <Users size={20} />, value: s.totalUsers?.toLocaleString(), label: 'Total Students', color: '#2dd4bf', delta: '+12%' },
    { icon: <BookOpen size={20} />, value: s.totalCourses?.toLocaleString(), label: 'Published Courses', color: '#f59e0b', delta: '+4%' },
    { icon: <DollarSign size={20} />, value: `₹${(s.totalRevenue / 100000).toFixed(1)}L`, label: 'Total Revenue', color: '#22c55e', delta: '+23%' },
    { icon: <TrendingUp size={20} />, value: s.totalLeads?.toLocaleString(), label: 'Leads Generated', color: '#a78bfa', delta: '+8%' },
  ];

  return (
    <div className={styles.page}>
      {showAddCourse && <AddCourseModal onClose={() => setShowAddCourse(false)} onSuccess={() => { fetchCourses(); setTab('courses'); }} />}
      {selectedStudent && <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} onBlock={handleBlock} onDelete={handleDelete} />}

      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Admin Dashboard</h1>
            <p className={styles.pageSubtitle}>Platform overview & management</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.btnPrimary} onClick={() => setShowAddCourse(true)}><Plus size={15} /> Add Course</button>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {STAT_CARDS.map(sc => (
            <div key={sc.label} className={styles.statCard}>
              <div className={styles.statTop}>
                <div className={styles.statIcon} style={{ color: sc.color, background: `${sc.color}18` }}>{sc.icon}</div>
                <span className={styles.statDelta} style={{ color: '#22c55e' }}>{sc.delta}</span>
              </div>
              <div className={styles.statValue}>{sc.value}</div>
              <div className={styles.statLabel}>{sc.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {['overview', 'courses', 'students', 'transactions'].map(t => (
            <button key={t} className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className={styles.overviewGrid}>
            <div className={styles.panel}>
              <div className={styles.panelHeader}><h2 className={styles.panelTitle}><DollarSign size={16} /> Recent Transactions</h2></div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr><th>Student</th><th>Course</th><th>Amount</th><th>Date</th></tr></thead>
                  <tbody>
                    {(payments.length ? payments : MOCK_PAYMENTS).map(p => (
                      <tr key={p._id}>
                        <td><div className={styles.userCell}><div className={styles.miniAvatar}>{p.user?.name?.charAt(0)}</div><div><div className={styles.userName}>{p.user?.name}</div><div className={styles.userEmail}>{p.user?.email}</div></div></div></td>
                        <td className={styles.courseCell}>{p.course?.title}</td>
                        <td className={styles.amountCell}>₹{p.amount?.toLocaleString()}</td>
                        <td className={styles.dateCell}>{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={styles.panel}>
              <div className={styles.panelHeader}><h2 className={styles.panelTitle}><Users size={16} /> Recent Students</h2></div>
              <div className={styles.userList}>
                {users.slice(0, 5).map(u => (
                  <div key={u._id} className={styles.userRow} onClick={() => setSelectedStudent(u)} style={{ cursor: 'pointer' }}>
                    <div className={styles.miniAvatar}>{u.name?.charAt(0)}</div>
                    <div className={styles.userInfo}>
                      <div className={styles.userName} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {u.name}
                        {u.isBlocked && <span style={{ fontSize: 10, background: 'rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: 4, padding: '1px 6px', fontWeight: 600 }}>BLOCKED</span>}
                      </div>
                      <div className={styles.userEmail}>{u.email}</div>
                    </div>
                    <ChevronRight size={16} style={{ color: '#8899aa' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {tab === 'courses' && (
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}><BookOpen size={16} /> All Courses</h2>
              <button className={styles.btnPrimary} onClick={() => setShowAddCourse(true)}><Plus size={14} /> New Course</button>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>Title</th><th>Category</th><th>Students</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {(courses.length ? courses : MOCK_COURSES).map(c => (
                    <tr key={c._id}>
                      <td className={styles.courseTitle}>{c.title}</td>
                      <td><span className={styles.catTag}>{c.category}</span></td>
                      <td className={styles.numCell}>{(c.enrollmentCount || c.totalStudents || 0).toLocaleString()}</td>
                      <td className={styles.amountCell}>₹{(c.discountPrice || c.price)?.toLocaleString()}</td>
                      <td><span className={`${styles.status} ${c.isPublished ? styles.published : styles.draft}`}>{c.isPublished ? 'Published' : 'Draft'}</span></td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.actionBtn}><Eye size={14} /></button>
                          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={async () => { if (window.confirm('Delete this course?')) { try { await api.delete(`/courses/${c._id}`); fetchCourses(); toast.success('Course deleted.'); } catch { toast.error('Failed to delete.'); } } }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {tab === 'students' && (
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}><Users size={16} /> All Students</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#061428', border: '1px solid #1a3a7a', borderRadius: 8, padding: '8px 14px' }}>
                <Search size={14} style={{ color: '#8899aa' }} />
                <input value={studentSearch} onChange={e => setStudentSearch(e.target.value)} placeholder="Search students..." style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 14, width: 180, fontFamily: 'inherit' }} />
              </div>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Enrolled</th>
                    <th>Completed</th>
                    <th>Sessions</th>
                    <th>Quizzes</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => {
                    const completed = u.progress?.filter(p => p.percentage === 100).length || 0;
                    const passed = u.quizResults?.filter(q => q.passed).length || 0;
                    return (
                      <tr key={u._id}>
                        <td>
                          <div className={styles.userCell}>
                            <div className={styles.miniAvatar} style={{ background: u.isBlocked ? '#3a1a1a' : undefined }}>{u.name?.charAt(0)}</div>
                            <div>
                              <div className={styles.userName}>{u.name}</div>
                              <div className={styles.userEmail}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className={styles.numCell}>{u.enrolledCourses?.length || 0}</td>
                        <td className={styles.numCell} style={{ color: '#22c55e' }}>{completed}</td>
                        <td className={styles.numCell}>{u.totalSessions || 0}</td>
                        <td className={styles.numCell} style={{ color: '#a78bfa' }}>{passed} passed</td>
                        <td>
                          <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 100, fontWeight: 600, background: u.isBlocked ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', color: u.isBlocked ? '#ef4444' : '#22c55e', border: `1px solid ${u.isBlocked ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}` }}>
                            {u.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button className={styles.actionBtn} title="View Details" onClick={() => setSelectedStudent(u)}><Eye size={14} /></button>
                            <button
                              className={styles.actionBtn}
                              title={u.isBlocked ? 'Unblock' : 'Block'}
                              onClick={() => handleBlock(u)}
                              style={{ color: u.isBlocked ? '#22c55e' : '#f59e0b' }}>
                              {u.isBlocked ? <Shield size={14} /> : <ShieldOff size={14} />}
                            </button>
                            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete" onClick={() => { if (window.confirm(`Delete ${u.name}?`)) handleDelete(u._id); }}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#8899aa' }}>
                  <AlertTriangle size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <p>No students found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {tab === 'transactions' && (
          <div className={styles.panel}>
            <div className={styles.panelHeader}><h2 className={styles.panelTitle}><DollarSign size={16} /> All Transactions</h2></div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>Student</th><th>Course</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {MOCK_PAYMENTS.map(p => (
                    <tr key={p._id}>
                      <td><div className={styles.userCell}><div className={styles.miniAvatar}>{p.user?.name?.charAt(0)}</div>{p.user?.name}</div></td>
                      <td>{p.course?.title}</td>
                      <td className={styles.amountCell}>₹{p.amount?.toLocaleString()}</td>
                      <td><span className={`${styles.status} ${styles.published}`}>Completed</span></td>
                      <td className={styles.dateCell}>{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
