import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, CheckCircle, Clock, BookOpen, Award } from 'lucide-react';
import api from '../utils/api';
import styles from './MyCourses.module.css';

const MOCK = [
  { _id: '1', slug: 'react-nextjs-2024', title: 'Advanced React & Next.js 2024', instructor: 'Rahul Sharma', thumbnail: 'https://picsum.photos/seed/react/400/220', progress: 68, completedLessons: 28, totalLessons: 42, category: 'Technology', duration: 42 },
  { _id: '2', slug: 'python-data-science', title: 'Python for Data Science & ML', instructor: 'Dr. Amit Joshi', thumbnail: 'https://picsum.photos/seed/python/400/220', progress: 32, completedLessons: 18, totalLessons: 56, category: 'Technology', duration: 56 },
  { _id: '3', slug: 'figma-ui-ux', title: 'Figma UI/UX Design Masterclass', instructor: 'Ananya Patel', thumbnail: 'https://picsum.photos/seed/design/400/220', progress: 100, completedLessons: 36, totalLessons: 36, category: 'Design', duration: 36 },
  { _id: '4', slug: 'digital-marketing', title: 'Digital Marketing & SEO', instructor: 'Vikram Singh', thumbnail: 'https://picsum.photos/seed/mkt/400/220', progress: 0, completedLessons: 0, totalLessons: 24, category: 'Marketing', duration: 24 },
];

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/users/profile')
      .then(res => setCourses(res.data.user?.enrolledCourses?.length ? res.data.user.enrolledCourses : MOCK))
      .catch(() => setCourses(MOCK))
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { key: 'all', label: 'All Courses' },
    { key: 'inprogress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
    { key: 'notstarted', label: 'Not Started' },
  ];

  const filtered = MOCK.filter(c => {
    if (filter === 'inprogress') return c.progress > 0 && c.progress < 100;
    if (filter === 'completed') return c.progress === 100;
    if (filter === 'notstarted') return c.progress === 0;
    return true;
  });

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>My Courses</h1>
            <p className={styles.pageSubtitle}>{MOCK.length} courses enrolled</p>
          </div>
          <Link to="/courses" className={styles.browsBtn}>+ Browse more courses</Link>
        </div>

        {/* Summary cards */}
        <div className={styles.summaryGrid}>
          {[
            { icon: <BookOpen size={18} />, value: MOCK.length, label: 'Total Enrolled', color: '#2dd4bf' },
            { icon: <Clock size={18} />, value: MOCK.filter(c => c.progress > 0 && c.progress < 100).length, label: 'In Progress', color: '#f59e0b' },
            { icon: <CheckCircle size={18} />, value: MOCK.filter(c => c.progress === 100).length, label: 'Completed', color: '#22c55e' },
            { icon: <Award size={18} />, value: MOCK.filter(c => c.progress === 100).length, label: 'Certificates', color: '#a78bfa' },
          ].map(s => (
            <div key={s.label} className={styles.summaryCard}>
              <div className={styles.summaryIcon} style={{ color: s.color, background: `${s.color}18` }}>{s.icon}</div>
              <div className={styles.summaryVal}>{s.value}</div>
              <div className={styles.summaryLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {tabs.map(t => (
            <button key={t.key} className={`${styles.tab} ${filter === t.key ? styles.tabActive : ''}`} onClick={() => setFilter(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Courses grid */}
        {loading ? (
          <div className={styles.grid}>
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 300, borderRadius: 16 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
            <h3>No courses here</h3>
            <p>Explore our catalogue and start learning</p>
            <Link to="/courses" className={styles.browsBtn}>Browse Courses</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(course => (
              <div key={course._id} className={styles.card}>
                <div className={styles.cardThumb}>
                  <img src={course.thumbnail} alt={course.title} className={styles.cardImg} />
                  <div className={styles.cardOverlay} />
                  {course.progress === 100 && (
                    <div className={styles.completedBadge}><CheckCircle size={14} /> Completed</div>
                  )}
                  <div className={styles.progressOverlay}>
                    <div className={styles.cardProgress}>
                      <div className={styles.cardProgressFill} style={{
                        width: `${course.progress}%`,
                        background: course.progress === 100 ? '#22c55e' : 'var(--amber-400)'
                      }} />
                    </div>
                    <span className={styles.cardProgressPct}>{course.progress}%</span>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardCat}>{course.category}</span>
                  <h3 className={styles.cardTitle}>{course.title}</h3>
                  <p className={styles.cardInstructor}>by {course.instructor}</p>
                  <div className={styles.cardMeta}>
                    <span><Clock size={12} /> {course.duration}h</span>
                    <span><BookOpen size={12} /> {course.completedLessons}/{course.totalLessons} lessons</span>
                  </div>
                  <div className={styles.cardActions}>
                    <Link to={`/course-details/${course.slug}`} className={`${styles.continueBtn} ${course.progress === 100 ? styles.reviewBtn : ''}`}>
                      <Play size={14} fill="currentColor" />
                      {course.progress === 0 ? 'Start' : course.progress === 100 ? 'Review' : 'Continue'}
                    </Link>
                    {course.progress === 100 && (
                      <button className={styles.certBtn}><Award size={14} /> Certificate</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
