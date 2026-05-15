import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, Play, BarChart2, CheckCircle, Calendar, Bell, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import styles from './StudentDashboard.module.css';

const MOCK_ENROLLED = [
  { _id: '1', slug: 'react-nextjs-2024', title: 'Advanced React & Next.js 2024', instructor: 'Rahul Sharma', thumbnail: 'https://picsum.photos/seed/react/300/170', progress: 68, totalLessons: 42, completedLessons: 28, category: 'Technology' },
  { _id: '2', slug: 'python-data-science', title: 'Python for Data Science & ML', instructor: 'Dr. Amit Joshi', thumbnail: 'https://picsum.photos/seed/python/300/170', progress: 32, totalLessons: 56, completedLessons: 18, category: 'Technology' },
  { _id: '3', slug: 'figma-ui-ux', title: 'Figma UI/UX Design Masterclass', instructor: 'Ananya Patel', thumbnail: 'https://picsum.photos/seed/design/300/170', progress: 100, totalLessons: 36, completedLessons: 36, category: 'Design' },
];

const ANNOUNCEMENTS = [
  { id: 1, title: 'New Test Series for JEE Main 2024', time: 'Today, 10:15 AM', type: 'new' },
  { id: 2, title: 'Live Class: React Advanced Patterns', time: 'Today, 3:00 PM', type: 'live' },
  { id: 3, title: 'Assignment deadline extended — Node.js', time: 'Yesterday', type: 'info' },
];

const UPCOMING = [
  { id: 1, title: 'React Hooks Deep Dive', course: 'Advanced React', time: 'Today, 5 PM', type: 'Live' },
  { id: 2, title: 'Python ML Quiz', course: 'Python for DS', time: 'Tomorrow, 11 AM', type: 'Quiz' },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/profile')
      .then(res => setCourses(res.data.user?.enrolledCourses || []))
      .catch(() => setCourses(MOCK_ENROLLED))
      .finally(() => setLoading(false));
  }, []);

  const displayCourses = courses.length ? courses : MOCK_ENROLLED;
  const completed = MOCK_ENROLLED.filter(c => c.progress === 100).length;
  const inProgress = MOCK_ENROLLED.filter(c => c.progress > 0 && c.progress < 100).length;
  const totalHours = 87;

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Welcome header */}
        <div className={styles.welcome}>
          <div>
            <p className={styles.greeting}>Good morning 👋</p>
            <h1 className={styles.welcomeName}>{user?.name || 'Learner'}</h1>
            <p className={styles.welcomeSub}>You have <span>{inProgress} courses</span> in progress. Keep it up!</p>
          </div>
          <div className={styles.welcomeActions}>
            <Link to="/courses" className={styles.btnPrimary}>Browse Courses</Link>
            <Link to="/my-courses" className={styles.btnOutline}>My Courses</Link>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {[
            { icon: <BookOpen size={20} />, value: displayCourses.length, label: 'Enrolled Courses', color: '#2dd4bf' },
            { icon: <Clock size={20} />, value: `${totalHours}h`, label: 'Learning Hours', color: '#f59e0b' },
            { icon: <Award size={20} />, value: completed, label: 'Certificates Earned', color: '#a78bfa' },
            { icon: <TrendingUp size={20} />, value: '68%', label: 'Avg. Progress', color: '#34d399' },
          ].map((s) => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: s.color, background: `${s.color}18` }}>{s.icon}</div>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className={styles.mainGrid}>
          {/* Left: courses + progress */}
          <div>
            {/* Continue Learning */}
            <div className={styles.section}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>Continue Learning</h2>
                <Link to="/my-courses" className={styles.seeAll}>View all <ChevronRight size={14} /></Link>
              </div>
              <div className={styles.courseList}>
                {loading ? (
                  [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 12 }} />)
                ) : (
                  MOCK_ENROLLED.map(course => (
                    <div key={course._id} className={styles.courseRow}>
                      <img src={course.thumbnail} alt={course.title} className={styles.courseThumb} />
                      <div className={styles.courseInfo}>
                        <span className={styles.courseCategory}>{course.category}</span>
                        <h3 className={styles.courseTitle}>{course.title}</h3>
                        <p className={styles.courseInstructor}>by {course.instructor}</p>
                        <div className={styles.progressWrap}>
                          <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${course.progress}%`, background: course.progress === 100 ? '#22c55e' : 'var(--amber-400)' }} />
                          </div>
                          <span className={styles.progressPct}>{course.progress}%</span>
                        </div>
                        <div className={styles.courseMetaRow}>
                          <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                          {course.progress === 100 && <span className={styles.completedTag}><CheckCircle size={12} /> Completed</span>}
                        </div>
                      </div>
                      <Link to={`/course-details/${course.slug}`} className={styles.playBtn}>
                        <Play size={16} fill="currentColor" />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming */}
            <div className={styles.section}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}><Calendar size={18} /> Upcoming</h2>
              </div>
              <div className={styles.upcomingList}>
                {UPCOMING.map(u => (
                  <div key={u.id} className={styles.upcomingItem}>
                    <div className={`${styles.upcomingType} ${u.type === 'Live' ? styles.live : styles.quiz}`}>
                      {u.type}
                    </div>
                    <div className={styles.upcomingInfo}>
                      <div className={styles.upcomingTitle}>{u.title}</div>
                      <div className={styles.upcomingCourse}>{u.course} · {u.time}</div>
                    </div>
                    <button className={styles.joinBtn}>{u.type === 'Live' ? 'Join' : 'Start'}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div>
            {/* Profile card */}
            <div className={styles.profileCard}>
              <div className={styles.profileAvatar}>{user?.name?.charAt(0) || 'S'}</div>
              <div className={styles.profileName}>{user?.name || 'Student'}</div>
              <div className={styles.profileEmail}>{user?.email}</div>
              <div className={styles.profileStats}>
                <div><div className={styles.pStatVal}>{displayCourses.length}</div><div className={styles.pStatLabel}>Courses</div></div>
                <div className={styles.pDivider} />
                <div><div className={styles.pStatVal}>{completed}</div><div className={styles.pStatLabel}>Completed</div></div>
                <div className={styles.pDivider} />
                <div><div className={styles.pStatVal}>{totalHours}h</div><div className={styles.pStatLabel}>Hours</div></div>
              </div>
            </div>

            {/* Announcements */}
            <div className={styles.announcementsCard}>
              <div className={styles.announcementsHeader}>
                <Bell size={16} className={styles.bellIcon} /> Announcements
              </div>
              {ANNOUNCEMENTS.map(a => (
                <div key={a.id} className={styles.announcement}>
                  <div className={`${styles.announceDot} ${styles[a.type]}`} />
                  <div>
                    <div className={styles.announceTitle}>{a.title}</div>
                    <div className={styles.announceTime}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly progress */}
            <div className={styles.weeklyCard}>
              <div className={styles.weeklyTitle}><BarChart2 size={16} /> Weekly Activity</div>
              <div className={styles.weeklyBars}>
                {[
                  { day: 'M', h: 2.5 }, { day: 'T', h: 1.5 }, { day: 'W', h: 4 },
                  { day: 'T', h: 0.5 }, { day: 'F', h: 3 }, { day: 'S', h: 2 }, { day: 'S', h: 1 },
                ].map((d, i) => (
                  <div key={i} className={styles.weeklyBarWrap}>
                    <div className={styles.weeklyBar} style={{ height: `${(d.h / 4) * 100}%` }} />
                    <span className={styles.weeklyDay}>{d.day}</span>
                  </div>
                ))}
              </div>
              <div className={styles.weeklyTotal}>14.5h this week</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
