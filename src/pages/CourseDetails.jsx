import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Users, BookOpen, Award, Play, CheckCircle, ChevronDown, ArrowRight, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import styles from './CourseDetails.module.css';

const MOCK = {
  _id: '1', slug: 'react-nextjs-2024', title: 'Advanced React & Next.js 2024', instructor: 'Rahul Sharma',
  category: 'Technology', level: 'Intermediate', price: 4999, discountPrice: 2499, rating: 4.9,
  reviewCount: 2100, enrollmentCount: 12000, duration: 42, certificate: true, language: 'Hindi + English',
  shortDescription: 'Master React 18, Next.js 14, TypeScript, and modern web development patterns used at top companies.',
  description: 'This comprehensive course takes you from intermediate React developer to a full-stack expert. You will learn React 18 features, Next.js 14 App Router, server components, TypeScript, Tailwind CSS, and build production-grade applications.',
  highlights: ['React 18 Concurrent Features', 'Next.js 14 App Router & Server Components', 'TypeScript from scratch', 'Real-world projects', 'Certificate of Completion', '42 hours of HD video', 'Lifetime access', '30-day money back guarantee'],
  requirements: ['Basic JavaScript knowledge', 'HTML & CSS basics', 'A computer with internet'],
  curriculum: [
    { title: 'Introduction to React 18', duration: 3, isPreview: true },
    { title: 'Hooks Deep Dive', duration: 5, isPreview: false },
    { title: 'State Management with Zustand', duration: 4, isPreview: false },
    { title: 'Next.js 14 App Router', duration: 8, isPreview: false },
    { title: 'TypeScript Integration', duration: 6, isPreview: false },
    { title: 'Full-Stack Project Build', duration: 16, isPreview: false },
  ],
};

export default function CourseDetails() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currOpen, setCurrOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    api.get(`/courses/${slug}`)
      .then(res => setCourse(res.data.course))
      .catch(() => setCourse(MOCK))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please log in to enroll');
      navigate('/login');
      return;
    }
    setEnrolling(true);
    try {
      const res = await api.post('/payment/create-order', { courseId: course._id });
      // In production: open Razorpay checkout here
      // For demo: simulate success
      toast.success('Enrollment successful! Check My Courses.');
      navigate('/my-courses');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return (
    <div style={{ paddingTop: 100, minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  if (!course) return null;

  const savings = course.discountPrice ? Math.round((1 - course.discountPrice / course.price) * 100) : 0;
  const isEnrolled = user?.enrolledCourses?.includes(course._id);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>
              <div className={styles.breadcrumb}>
                <Link to="/courses">Courses</Link> / <span>{course.category}</span>
              </div>
              <div className={`badge badge-teal ${styles.catBadge}`}>{course.category}</div>
              <h1 className={styles.title}>{course.title}</h1>
              <p className={styles.shortDesc}>{course.shortDescription}</p>

              <div className={styles.metaRow}>
                <span className={styles.ratingBadge}>
                  <Star size={14} fill="#f59e0b" stroke="none" />
                  {course.rating?.toFixed(1)}
                </span>
                <span className={styles.metaText}>({course.reviewCount?.toLocaleString()} reviews)</span>
                <span className={styles.metaDot}>·</span>
                <Users size={14} className={styles.metaIcon} />
                <span className={styles.metaText}>{course.enrollmentCount?.toLocaleString()} enrolled</span>
                <span className={styles.metaDot}>·</span>
                <BarChart2 size={14} className={styles.metaIcon} />
                <span className={styles.metaText}>{course.level}</span>
              </div>

              <div className={styles.instructorRow}>
                <div className={styles.instAvatar}>{course.instructor?.charAt(0)}</div>
                <span>by <strong>{course.instructor}</strong></span>
              </div>

              <div className={styles.quickMeta}>
                <span><Clock size={14} /> {course.duration}h total</span>
                <span><BookOpen size={14} /> {course.language}</span>
                {course.certificate && <span><Award size={14} /> Certificate</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Main content */}
          <div className={styles.main}>
            {/* What you'll learn */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>What You'll Learn</h2>
              <div className={styles.highlightGrid}>
                {course.highlights?.map((h, i) => (
                  <div key={i} className={styles.highlightItem}>
                    <CheckCircle size={16} className={styles.checkIcon} />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            {course.requirements?.length > 0 && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Requirements</h2>
                <ul className={styles.reqList}>
                  {course.requirements.map((r, i) => (
                    <li key={i} className={styles.reqItem}>
                      <span className={styles.reqDot} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Curriculum */}
            <div className={styles.card}>
              <div className={styles.currHeader}>
                <h2 className={styles.cardTitle}>Course Curriculum</h2>
                <span className={styles.currMeta}>{course.curriculum?.length} sections · {course.duration}h total</span>
              </div>
              <div className={styles.curriculum}>
                {(currOpen ? course.curriculum : course.curriculum?.slice(0, 4))?.map((lesson, i) => (
                  <div key={i} className={styles.lesson}>
                    <div className={styles.lessonLeft}>
                      <div className={`${styles.lessonIcon} ${lesson.isPreview ? styles.lessonPreview : ''}`}>
                        <Play size={12} fill="currentColor" />
                      </div>
                      <span className={styles.lessonTitle}>{lesson.title}</span>
                      {lesson.isPreview && <span className={styles.previewTag}>Preview</span>}
                    </div>
                    <span className={styles.lessonDuration}>{lesson.duration}h</span>
                  </div>
                ))}
              </div>
              {course.curriculum?.length > 4 && (
                <button className={styles.showMoreBtn} onClick={() => setCurrOpen(!currOpen)}>
                  {currOpen ? 'Show less' : `Show all ${course.curriculum.length} lessons`}
                  <ChevronDown size={14} className={currOpen ? styles.rotated : ''} />
                </button>
              )}
            </div>

            {/* Description */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>About This Course</h2>
              <p className={styles.description}>{course.description}</p>
            </div>
          </div>

          {/* Sticky purchase card */}
          <div className={styles.purchaseCard}>
            <div className={styles.pcThumb}>
              <img
                src={course.thumbnail || `https://picsum.photos/seed/${course._id}/400/220`}
                alt={course.title}
                className={styles.pcImg}
              />
              <div className={styles.pcPlayOverlay}>
                <div className={styles.pcPlay}><Play size={20} fill="white" /></div>
              </div>
            </div>
            <div className={styles.pcBody}>
              <div className={styles.pcPricing}>
                {course.discountPrice ? (
                  <>
                    <span className={styles.pcPrice}>₹{course.discountPrice?.toLocaleString()}</span>
                    <span className={styles.pcOriginal}>₹{course.price?.toLocaleString()}</span>
                    <span className={styles.pcSavings}>{savings}% off</span>
                  </>
                ) : (
                  <span className={styles.pcPrice}>₹{course.price?.toLocaleString()}</span>
                )}
              </div>
              {course.discountPrice && (
                <div className={styles.pcUrgency}>⏰ 2 days left at this price!</div>
              )}
              <button
                className={styles.enrollBtn}
                onClick={handleEnroll}
                disabled={enrolling || isEnrolled}
              >
                {isEnrolled ? 'Already Enrolled' : enrolling ? 'Processing...' : 'Enroll Now'}
                {!isEnrolled && !enrolling && <ArrowRight size={16} />}
              </button>
              <Link to="/compare-courses" className={styles.compareBtn}>
                Compare with other courses
              </Link>
              <div className={styles.pcPerks}>
                {['Full lifetime access', 'Access on mobile & desktop', 'Certificate of completion', '30-day money-back guarantee'].map((p) => (
                  <div key={p} className={styles.perk}>
                    <CheckCircle size={14} className={styles.perkCheck} />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
